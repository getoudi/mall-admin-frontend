package com.mall.cart.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mall.cart.entity.CartItem;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CartItemMapper extends BaseMapper<CartItem> {
}
