package com.mall.payment.service;

import com.mall.payment.entity.Payment;

public interface PaymentService {

    Payment createPayment(String orderSn, Long userId, java.math.BigDecimal amount, Integer payType);

    Payment getPaymentBySn(String paymentSn);

    void paymentCallback(String paymentSn);
}
