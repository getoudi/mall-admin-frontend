package com.mall.stock.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.mall.common.exception.BusinessException;
import com.mall.stock.entity.Stock;
import com.mall.stock.entity.StockLock;
import com.mall.stock.mapper.StockLockMapper;
import com.mall.stock.mapper.StockMapper;
import com.mall.stock.service.StockService;
import lombok.RequiredArgsConstructor;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class StockServiceImpl implements StockService {

    private final StockMapper stockMapper;
    private final StockLockMapper stockLockMapper;
    private final RedissonClient redissonClient;

    @Override
    public Stock getStockBySkuId(Long skuId) {
        LambdaQueryWrapper<Stock> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Stock::getSkuId, skuId);
        return stockMapper.selectOne(wrapper);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean lockStock(Long skuId, Integer quantity, String orderSn) {
        String lockKey = "stock:lock:" + skuId;
        RLock lock = redissonClient.getLock(lockKey);

        try {
            if (!lock.tryLock(5, 10, TimeUnit.SECONDS)) {
                throw new BusinessException("系统繁忙，请稍后重试");
            }

            Stock stock = stockMapper.selectOne(
                    new LambdaQueryWrapper<Stock>().eq(Stock::getSkuId, skuId));

            if (stock == null) {
                throw new BusinessException("SKU " + skuId + " 库存记录不存在");
            }

            if (stock.getAvailableStock() < quantity) {
                throw new BusinessException("SKU " + skuId + " 库存不足，当前可用库存：" + stock.getAvailableStock());
            }

            int currentVersion = stock.getVersion();
            stock.setAvailableStock(stock.getAvailableStock() - quantity);
            stock.setLockedStock(stock.getLockedStock() + quantity);

            LambdaUpdateWrapper<Stock> updateWrapper = new LambdaUpdateWrapper<>();
            updateWrapper.eq(Stock::getSkuId, skuId)
                    .eq(Stock::getVersion, currentVersion)
                    .set(Stock::getAvailableStock, stock.getAvailableStock())
                    .set(Stock::getLockedStock, stock.getLockedStock())
                    .set(Stock::getVersion, currentVersion + 1);

            int result = stockMapper.update(null, updateWrapper);
            if (result == 0) {
                throw new BusinessException("库存更新失败，请重试");
            }

            StockLock stockLock = new StockLock();
            stockLock.setOrderSn(orderSn);
            stockLock.setSkuId(skuId);
            stockLock.setQuantity(quantity);
            stockLockMapper.insert(stockLock);

            return true;
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new BusinessException("系统中断，请重试");
        } finally {
            if (lock.isHeldByCurrentThread()) {
                lock.unlock();
            }
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean deductStock(String orderSn) {
        List<StockLock> lockRecords = stockLockMapper.selectList(
                new LambdaQueryWrapper<StockLock>().eq(StockLock::getOrderSn, orderSn));

        if (lockRecords.isEmpty()) {
            throw new BusinessException("订单 " + orderSn + " 没有锁定记录");
        }

        for (StockLock lockRecord : lockRecords) {
            LambdaUpdateWrapper<Stock> updateWrapper = new LambdaUpdateWrapper<>();
            updateWrapper.eq(Stock::getSkuId, lockRecord.getSkuId())
                    .setSql("locked_stock = locked_stock - " + lockRecord.getQuantity())
                    .setSql("total_stock = total_stock - " + lockRecord.getQuantity());

            stockMapper.update(null, updateWrapper);
        }

        stockLockMapper.delete(
                new LambdaQueryWrapper<StockLock>().eq(StockLock::getOrderSn, orderSn));

        return true;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean releaseStock(String orderSn) {
        List<StockLock> lockRecords = stockLockMapper.selectList(
                new LambdaQueryWrapper<StockLock>().eq(StockLock::getOrderSn, orderSn));

        if (lockRecords.isEmpty()) {
            throw new BusinessException("订单 " + orderSn + " 没有锁定记录");
        }

        for (StockLock lockRecord : lockRecords) {
            LambdaUpdateWrapper<Stock> updateWrapper = new LambdaUpdateWrapper<>();
            updateWrapper.eq(Stock::getSkuId, lockRecord.getSkuId())
                    .setSql("locked_stock = locked_stock - " + lockRecord.getQuantity())
                    .setSql("available_stock = available_stock + " + lockRecord.getQuantity());

            stockMapper.update(null, updateWrapper);
        }

        stockLockMapper.delete(
                new LambdaQueryWrapper<StockLock>().eq(StockLock::getOrderSn, orderSn));

        return true;
    }
}
