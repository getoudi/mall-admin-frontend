package com.mall.stock.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mall.stock.entity.StockLock;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface StockLockMapper extends BaseMapper<StockLock> {
}
