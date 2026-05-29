package com.mall.payment.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("pms_payment")
public class Payment {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String orderSn;

    private String paymentSn;

    private Long userId;

    private BigDecimal amount;

    private Integer payType;

    private Integer status;

    private LocalDateTime createTime;

    private LocalDateTime payTime;
}
