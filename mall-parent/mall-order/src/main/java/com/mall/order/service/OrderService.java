package com.mall.order.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mall.order.entity.Order;

public interface OrderService {

    Order createOrder(Long userId, String token, Long addressId, java.util.List<Long> cartItemIds, String remark);

    Page<Order> getOrderList(Long userId, Integer status, Integer pageNum, Integer pageSize);

    Order getOrderDetail(Long userId, Long orderId);

    void cancelOrder(Long userId, Long orderId);

    void confirmOrder(Long userId, Long orderId);

    void deleteOrder(Long userId, Long orderId);

    void paySuccess(String orderSn);
}
