package com.mall.order.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mall.common.exception.BusinessException;
import com.mall.common.utils.SnowflakeIdWorker;
import com.mall.order.entity.*;
import com.mall.order.mapper.OrderItemMapper;
import com.mall.order.mapper.OrderMapper;
import com.mall.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import com.mall.common.result.Result;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderMapper orderMapper;
    private final OrderItemMapper orderItemMapper;
    private final RestTemplate restTemplate;

    private static final BigDecimal FREE_FREIGHT_AMOUNT = new BigDecimal("99");
    private static final BigDecimal FREIGHT_AMOUNT = new BigDecimal("6");

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Order createOrder(Long userId, String token, Long addressId, List<Long> cartItemIds, String remark) {
        // 1. 获取购物车商品（使用用户的token认证）
        String cartUrl = "http://localhost:8003/cart/list";
        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.set("Authorization", token);
        HttpEntity<?> httpEntity = new HttpEntity<>(headers);
        ResponseEntity<Result<List<CartItem>>> cartResponse = restTemplate.exchange(
                cartUrl, HttpMethod.GET,
                httpEntity,
                new ParameterizedTypeReference<Result<List<CartItem>>>() {});
        Result<List<CartItem>> result = cartResponse.getBody();
        List<CartItem> cartItems = result != null ? result.getData() : null;

        if (cartItems == null || cartItems.isEmpty()) {
            throw new BusinessException("购物车为空");
        }

        // 如果没有指定cartItemIds，则使用所有购物车商品
        List<CartItem> selectedItems;
        if (cartItemIds == null || cartItemIds.isEmpty()) {
            selectedItems = cartItems;
        } else {
            selectedItems = cartItems.stream()
                    .filter(item -> cartItemIds.contains(item.getId()))
                    .toList();
        }

        if (selectedItems.isEmpty()) {
            throw new BusinessException("请选择要结算的商品");
        }

        // 2. 计算金额
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (CartItem item : selectedItems) {
            totalAmount = totalAmount.add(item.getPrice().multiply(new BigDecimal(item.getQuantity())));
        }

        BigDecimal freightAmount = totalAmount.compareTo(FREE_FREIGHT_AMOUNT) >= 0
                ? BigDecimal.ZERO : FREIGHT_AMOUNT;
        BigDecimal payAmount = totalAmount.add(freightAmount);

        // 3. 生成订单号
        String orderSn = generateOrderSn();

        // 4. 创建订单
        Order order = new Order();
        order.setOrderSn(orderSn);
        order.setUserId(userId);
        order.setTotalAmount(totalAmount);
        order.setFreightAmount(freightAmount);
        order.setPayAmount(payAmount);
        order.setStatus(0);
        order.setReceiverName("默认收货人");
        order.setReceiverPhone("13800138000");
        order.setReceiverAddress("默认收货地址");
        order.setRemark(remark != null ? remark : "");
        orderMapper.insert(order);

        // 5. 创建订单商品
        for (CartItem item : selectedItems) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrderId(order.getId());
            orderItem.setSkuId(item.getSkuId());
            orderItem.setSkuName(item.getSkuName());
            orderItem.setSkuImage(item.getSkuImage());
            orderItem.setPrice(item.getPrice());
            orderItem.setQuantity(item.getQuantity());
            orderItem.setTotalAmount(item.getPrice().multiply(new BigDecimal(item.getQuantity())));
            orderItemMapper.insert(orderItem);
        }

        // 6. 清空购物车
        for (CartItem item : selectedItems) {
            String deleteUrl = "http://localhost:8003/cart/delete/" + item.getId();
            org.springframework.http.HttpEntity<?> deleteEntity = new org.springframework.http.HttpEntity<>(headers);
            restTemplate.exchange(deleteUrl, HttpMethod.DELETE, deleteEntity, Void.class);
        }

        return order;
    }

    @Override
    public Page<Order> getOrderList(Long userId, Integer status, Integer pageNum, Integer pageSize) {
        Page<Order> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<Order> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Order::getUserId, userId);

        if (status != null) {
            wrapper.eq(Order::getStatus, status);
        }

        wrapper.orderByDesc(Order::getCreateTime);
        return orderMapper.selectPage(page, wrapper);
    }

    @Override
    public Order getOrderDetail(Long userId, Long orderId) {
        Order order = orderMapper.selectById(orderId);
        if (order == null || !order.getUserId().equals(userId)) {
            throw new BusinessException("订单不存在");
        }

        // 查询订单商品
        LambdaQueryWrapper<OrderItem> itemWrapper = new LambdaQueryWrapper<>();
        itemWrapper.eq(OrderItem::getOrderId, orderId);
        List<OrderItem> items = orderItemMapper.selectList(itemWrapper);
        order.setItems(items);

        return order;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void cancelOrder(Long userId, Long orderId) {
        Order order = orderMapper.selectById(orderId);
        if (order == null || !order.getUserId().equals(userId)) {
            throw new BusinessException("订单不存在");
        }

        if (order.getStatus() != 0) {
            throw new BusinessException("只能取消待付款订单");
        }

        // 释放库存
        String releaseUrl = "http://localhost:8005/stock/release";
        Map<String, String> releaseParams = new HashMap<>();
        releaseParams.put("orderSn", order.getOrderSn());
        restTemplate.postForEntity(releaseUrl, releaseParams, null);

        // 更新订单状态
        order.setStatus(4);
        orderMapper.updateById(order);
    }

    @Override
    public void confirmOrder(Long userId, Long orderId) {
        Order order = orderMapper.selectById(orderId);
        if (order == null || !order.getUserId().equals(userId)) {
            throw new BusinessException("订单不存在");
        }

        if (order.getStatus() != 2) {
            throw new BusinessException("只能确认待收货订单");
        }

        order.setStatus(3);
        orderMapper.updateById(order);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteOrder(Long userId, Long orderId) {
        Order order = orderMapper.selectById(orderId);
        if (order == null || !order.getUserId().equals(userId)) {
            throw new BusinessException("订单不存在");
        }

        if (order.getStatus() == 2 || order.getStatus() == 3) {
            throw new BusinessException("已发货或已完成的订单不能删除");
        }

        // 删除订单商品
        LambdaQueryWrapper<OrderItem> itemWrapper = new LambdaQueryWrapper<>();
        itemWrapper.eq(OrderItem::getOrderId, orderId);
        orderItemMapper.delete(itemWrapper);

        // 删除订单
        orderMapper.deleteById(orderId);
    }

    @Override
    public void paySuccess(String orderSn) {
        LambdaQueryWrapper<Order> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Order::getOrderSn, orderSn);
        Order order = orderMapper.selectOne(wrapper);

        if (order == null) {
            throw new BusinessException("订单不存在");
        }

        if (order.getStatus() != 0) {
            throw new BusinessException("订单状态异常");
        }

        order.setStatus(1);
        order.setPayTime(LocalDateTime.now());
        orderMapper.updateById(order);
    }

    private String generateOrderSn() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String id = String.valueOf(SnowflakeIdWorker.getInstance().nextId());
        String shortId = id.substring(id.length() - 6);
        return "ORD" + timestamp + shortId;
    }
}
