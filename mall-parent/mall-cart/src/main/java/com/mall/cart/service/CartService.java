package com.mall.cart.service;

import com.mall.cart.entity.CartItem;

import java.util.List;

public interface CartService {

    List<CartItem> getCartList(Long userId);

    void addItem(Long userId, CartItem item);

    void updateQuantity(Long userId, Long id, Integer quantity);

    void deleteItem(Long userId, Long id);

    void clearCart(Long userId);

    void updateChecked(Long userId, Long id, Boolean checked);

    void checkAll(Long userId, Boolean checked);

    List<CartItem> getCheckedItems(Long userId);
}
