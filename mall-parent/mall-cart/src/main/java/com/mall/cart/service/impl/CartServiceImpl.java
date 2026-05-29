package com.mall.cart.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.mall.cart.entity.CartItem;
import com.mall.cart.mapper.CartItemMapper;
import com.mall.cart.service.CartService;
import com.mall.common.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartItemMapper cartItemMapper;

    @Override
    public List<CartItem> getCartList(Long userId) {
        LambdaQueryWrapper<CartItem> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(CartItem::getUserId, userId)
                .orderByDesc(CartItem::getCreateTime);
        return cartItemMapper.selectList(wrapper);
    }

    @Override
    public void addItem(Long userId, CartItem item) {
        LambdaQueryWrapper<CartItem> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(CartItem::getUserId, userId)
                .eq(CartItem::getSkuId, item.getSkuId());
        CartItem existItem = cartItemMapper.selectOne(wrapper);

        if (existItem != null) {
            existItem.setQuantity(existItem.getQuantity() + item.getQuantity());
            cartItemMapper.updateById(existItem);
        } else {
            item.setUserId(userId);
            item.setChecked(1);
            cartItemMapper.insert(item);
        }
    }

    @Override
    public void updateQuantity(Long userId, Long id, Integer quantity) {
        CartItem cartItem = cartItemMapper.selectById(id);
        if (cartItem == null || !cartItem.getUserId().equals(userId)) {
            throw new BusinessException("购物车项不存在");
        }
        cartItem.setQuantity(quantity);
        cartItemMapper.updateById(cartItem);
    }

    @Override
    public void deleteItem(Long userId, Long id) {
        LambdaQueryWrapper<CartItem> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(CartItem::getId, id)
                .eq(CartItem::getUserId, userId);
        int result = cartItemMapper.delete(wrapper);
        if (result == 0) {
            throw new BusinessException("购物车项不存在");
        }
    }

    @Override
    public void clearCart(Long userId) {
        LambdaQueryWrapper<CartItem> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(CartItem::getUserId, userId);
        cartItemMapper.delete(wrapper);
    }

    @Override
    public void updateChecked(Long userId, Long id, Boolean checked) {
        LambdaUpdateWrapper<CartItem> wrapper = new LambdaUpdateWrapper<>();
        wrapper.eq(CartItem::getId, id)
                .eq(CartItem::getUserId, userId)
                .set(CartItem::getChecked, checked ? 1 : 0);
        cartItemMapper.update(null, wrapper);
    }

    @Override
    public void checkAll(Long userId, Boolean checked) {
        LambdaUpdateWrapper<CartItem> wrapper = new LambdaUpdateWrapper<>();
        wrapper.eq(CartItem::getUserId, userId)
                .set(CartItem::getChecked, checked ? 1 : 0);
        cartItemMapper.update(null, wrapper);
    }

    @Override
    public List<CartItem> getCheckedItems(Long userId) {
        LambdaQueryWrapper<CartItem> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(CartItem::getUserId, userId)
                .eq(CartItem::getChecked, 1);
        return cartItemMapper.selectList(wrapper);
    }
}
