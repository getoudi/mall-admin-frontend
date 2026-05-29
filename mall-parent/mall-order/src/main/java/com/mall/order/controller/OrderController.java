package com.mall.order.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mall.common.result.Result;
import com.mall.common.utils.JwtUtils;
import com.mall.order.entity.Order;
import com.mall.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/order")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/create")
    public Result<Order> createOrder(@RequestHeader("Authorization") String token,
                                     @RequestBody Map<String, Object> params) {
        Long userId = JwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        Long addressId = params.get("addressId") != null ? Long.valueOf(params.get("addressId").toString()) : null;
        List<Long> cartItemIds = params.get("cartItemIds") != null
                ? ((List<?>) params.get("cartItemIds")).stream()
                    .map(id -> Long.valueOf(id.toString()))
                    .toList()
                : null;
        String remark = params.get("remark") != null ? params.get("remark").toString() : "";

        Order order = orderService.createOrder(userId, token, addressId, cartItemIds, remark);
        return Result.success(order);
    }

    @GetMapping("/list")
    public Result<Page<Order>> getOrderList(@RequestHeader("Authorization") String token,
                                            @RequestParam(required = false) Integer status,
                                            @RequestParam(defaultValue = "1") Integer pageNum,
                                            @RequestParam(defaultValue = "10") Integer pageSize) {
        Long userId = JwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        Page<Order> page = orderService.getOrderList(userId, status, pageNum, pageSize);
        return Result.success(page);
    }

    @GetMapping("/{id}")
    public Result<Order> getOrderDetail(@RequestHeader("Authorization") String token,
                                        @PathVariable Long id) {
        Long userId = JwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        Order order = orderService.getOrderDetail(userId, id);
        return Result.success(order);
    }

    @PutMapping("/cancel/{id}")
    public Result<?> cancelOrder(@RequestHeader("Authorization") String token,
                                 @PathVariable Long id) {
        Long userId = JwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        orderService.cancelOrder(userId, id);
        return Result.success();
    }

    @PutMapping("/confirm/{id}")
    public Result<?> confirmOrder(@RequestHeader("Authorization") String token,
                                  @PathVariable Long id) {
        Long userId = JwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        orderService.confirmOrder(userId, id);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<?> deleteOrder(@RequestHeader("Authorization") String token,
                                 @PathVariable Long id) {
        Long userId = JwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        orderService.deleteOrder(userId, id);
        return Result.success();
    }

    @PutMapping("/paySuccess/{orderSn}")
    public Result<?> paySuccess(@PathVariable String orderSn) {
        orderService.paySuccess(orderSn);
        return Result.success();
    }
}
