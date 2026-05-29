package com.mall.order.entity;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CartItem {

    private Long id;

    private Long userId;

    private Long skuId;

    private Long productId;

    private String skuName;

    private String skuImage;

    private BigDecimal price;

    private Integer quantity;

    private Integer checked;
}
