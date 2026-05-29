package com.mall.payment.controller;

import com.mall.common.result.Result;
import com.mall.common.utils.JwtUtils;
import com.mall.payment.entity.Payment;
import com.mall.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create")
    public Result<Map<String, Object>> createPayment(@RequestHeader("Authorization") String token,
                                                     @RequestBody Map<String, Object> params) {
        Long userId = JwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        String orderSn = params.get("orderSn").toString();
        Integer payType = Integer.valueOf(params.get("payType").toString());
        BigDecimal amount = new BigDecimal(params.get("amount").toString());

        Payment payment = paymentService.createPayment(orderSn, userId, amount, payType);

        Map<String, Object> result = new HashMap<>();
        result.put("paymentSn", payment.getPaymentSn());
        result.put("amount", payment.getAmount());
        result.put("payType", payment.getPayType());
        result.put("orderSn", payment.getOrderSn());

        return Result.success(result);
    }

    @GetMapping("/status/{paymentSn}")
    public Result<Payment> getPaymentStatus(@PathVariable String paymentSn) {
        Payment payment = paymentService.getPaymentBySn(paymentSn);
        return Result.success(payment);
    }

    @PostMapping("/callback/{paymentSn}")
    public Result<?> paymentCallback(@PathVariable String paymentSn) {
        paymentService.paymentCallback(paymentSn);
        return Result.success();
    }
}
