package com.mall.stock.controller;

import com.mall.common.result.Result;
import com.mall.stock.entity.Stock;
import com.mall.stock.service.StockService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/stock")
@RequiredArgsConstructor
public class StockController {

    private final StockService stockService;

    @GetMapping("/{skuId}")
    public Result<Stock> getStock(@PathVariable Long skuId) {
        Stock stock = stockService.getStockBySkuId(skuId);
        return Result.success(stock);
    }

    @PostMapping("/lock")
    public Result<?> lockStock(@RequestBody Map<String, Object> params) {
        Long skuId = Long.valueOf(params.get("skuId").toString());
        Integer quantity = Integer.valueOf(params.get("quantity").toString());
        String orderSn = params.get("orderSn").toString();

        boolean success = stockService.lockStock(skuId, quantity, orderSn);
        return success ? Result.success() : Result.error("锁定失败");
    }

    @PostMapping("/deduct")
    public Result<?> deductStock(@RequestBody Map<String, String> params) {
        String orderSn = params.get("orderSn");

        boolean success = stockService.deductStock(orderSn);
        return success ? Result.success() : Result.error("扣减失败");
    }

    @PostMapping("/release")
    public Result<?> releaseStock(@RequestBody Map<String, String> params) {
        String orderSn = params.get("orderSn");

        boolean success = stockService.releaseStock(orderSn);
        return success ? Result.success() : Result.error("释放失败");
    }
}
