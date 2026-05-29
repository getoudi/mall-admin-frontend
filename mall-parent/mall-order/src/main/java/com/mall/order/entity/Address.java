package com.mall.order.entity;

import lombok.Data;

@Data
public class Address {

    private Long id;

    private Long userId;

    private String name;

    private String phone;

    private String province;

    private String city;

    private String district;

    private String detail;

    private Integer isDefault;
}
