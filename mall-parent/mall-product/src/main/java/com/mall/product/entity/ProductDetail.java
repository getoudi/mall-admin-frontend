package com.mall.product.entity;

import lombok.Data;

import java.util.List;

@Data
public class ProductDetail {

    private Product product;
    private List<Sku> skuList;
}
