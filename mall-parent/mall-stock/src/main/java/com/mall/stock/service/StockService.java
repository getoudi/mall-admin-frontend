package com.mall.stock.service;

import com.mall.stock.entity.Stock;

public interface StockService {

    Stock getStockBySkuId(Long skuId);

    boolean lockStock(Long skuId, Integer quantity, String orderSn);

    boolean deductStock(String orderSn);

    boolean releaseStock(String orderSn);
}
