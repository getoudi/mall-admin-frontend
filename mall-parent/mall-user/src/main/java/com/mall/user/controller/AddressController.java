package com.mall.user.controller;

import com.mall.common.result.Result;
import com.mall.common.utils.JwtUtils;
import com.mall.user.entity.Address;
import com.mall.user.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/address")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    @GetMapping("/list")
    public Result<List<Address>> list(@RequestHeader("Authorization") String token) {
        Long userId = JwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        List<Address> list = addressService.listByUserId(userId);
        return Result.success(list);
    }

    @PostMapping("/add")
    public Result<?> add(@RequestHeader("Authorization") String token, @RequestBody Address address) {
        Long userId = JwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        address.setUserId(userId);
        addressService.add(address);
        return Result.success();
    }

    @PutMapping("/update")
    public Result<?> update(@RequestHeader("Authorization") String token, @RequestBody Address address) {
        Long userId = JwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        address.setUserId(userId);
        addressService.update(address);
        return Result.success();
    }

    @DeleteMapping("/delete/{id}")
    public Result<?> delete(@RequestHeader("Authorization") String token, @PathVariable Long id) {
        Long userId = JwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        addressService.delete(id, userId);
        return Result.success();
    }

    @PutMapping("/default/{id}")
    public Result<?> setDefault(@RequestHeader("Authorization") String token, @PathVariable Long id) {
        Long userId = JwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        addressService.setDefault(id, userId);
        return Result.success();
    }
}
