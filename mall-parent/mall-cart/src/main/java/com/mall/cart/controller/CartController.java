package com.mall.cart.controller;

import com.mall.cart.entity.CartItem;
import com.mall.cart.service.CartService;
import com.mall.common.result.Result;
import com.mall.common.utils.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping("/list")
    public Result<List<CartItem>> getCartList(@RequestHeader("Authorization") String token) {
        Long userId = JwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        List<CartItem> list = cartService.getCartList(userId);
        return Result.success(list);
    }

    @PostMapping("/add")
    public Result<?> addItem(@RequestHeader("Authorization") String token, @RequestBody CartItem item) {
        Long userId = JwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        cartService.addItem(userId, item);
        return Result.success();
    }

    @PutMapping("/update/{id}")
    public Result<?> updateQuantity(@RequestHeader("Authorization") String token,
                                    @PathVariable Long id,
                                    @RequestParam Integer quantity) {
        Long userId = JwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        cartService.updateQuantity(userId, id, quantity);
        return Result.success();
    }

    @DeleteMapping("/delete/{id}")
    public Result<?> deleteItem(@RequestHeader("Authorization") String token, @PathVariable Long id) {
        Long userId = JwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        cartService.deleteItem(userId, id);
        return Result.success();
    }

    @DeleteMapping("/clear")
    public Result<?> clearCart(@RequestHeader("Authorization") String token) {
        Long userId = JwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        cartService.clearCart(userId);
        return Result.success();
    }

    @PutMapping("/check/{id}")
    public Result<?> updateChecked(@RequestHeader("Authorization") String token,
                                   @PathVariable Long id,
                                   @RequestParam Boolean checked) {
        Long userId = JwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        cartService.updateChecked(userId, id, checked);
        return Result.success();
    }

    @PutMapping("/checkAll")
    public Result<?> checkAll(@RequestHeader("Authorization") String token,
                              @RequestParam Boolean checked) {
        Long userId = JwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        cartService.checkAll(userId, checked);
        return Result.success();
    }

    @GetMapping("/checked")
    public Result<List<CartItem>> getCheckedItems(@RequestHeader("Authorization") String token) {
        Long userId = JwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        List<CartItem> list = cartService.getCheckedItems(userId);
        return Result.success(list);
    }
}
