package com.mall.stock.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("wms_stock_lock")
public class StockLock {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String orderSn;

    private Long skuId;

    private Integer quantity;

    private LocalDateTime lockTime;
}
