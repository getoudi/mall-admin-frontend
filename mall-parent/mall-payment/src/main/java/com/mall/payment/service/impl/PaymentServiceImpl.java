package com.mall.payment.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.mall.common.exception.BusinessException;
import com.mall.common.utils.SnowflakeIdWorker;
import com.mall.payment.entity.Payment;
import com.mall.payment.mapper.PaymentMapper;
import com.mall.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentMapper paymentMapper;
    private final RestTemplate restTemplate;

    @Override
    public Payment createPayment(String orderSn, Long userId, BigDecimal amount, Integer payType) {
        String paymentSn = generatePaymentSn();

        Payment payment = new Payment();
        payment.setOrderSn(orderSn);
        payment.setPaymentSn(paymentSn);
        payment.setUserId(userId);
        payment.setAmount(amount);
        payment.setPayType(payType);
        payment.setStatus(0);

        paymentMapper.insert(payment);
        return payment;
    }

    @Override
    public Payment getPaymentBySn(String paymentSn) {
        LambdaQueryWrapper<Payment> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Payment::getPaymentSn, paymentSn);
        return paymentMapper.selectOne(wrapper);
    }

    @Override
    public void paymentCallback(String paymentSn) {
        Payment payment = getPaymentBySn(paymentSn);
        if (payment == null) {
            throw new BusinessException("支付记录不存在");
        }

        // 幂等处理：已支付的不重复处理
        if (payment.getStatus() == 1) {
            return;
        }

        // 更新支付状态
        payment.setStatus(1);
        payment.setPayTime(LocalDateTime.now());
        paymentMapper.updateById(payment);

        // 通知订单服务支付成功
        try {
            String orderCallbackUrl = "http://localhost:8004/order/paySuccess/" + payment.getOrderSn();
            restTemplate.put(orderCallbackUrl, null);
        } catch (Exception e) {
            // 订单服务调用失败，记录日志，后续可通过定时任务补偿
            throw new BusinessException("订单服务通知失败，请稍后重试");
        }
    }

    private String generatePaymentSn() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String id = String.valueOf(SnowflakeIdWorker.getInstance().nextId());
        String shortId = id.substring(id.length() - 6);
        return "PAY" + timestamp + shortId;
    }
}
