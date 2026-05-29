package com.mall.user.controller;

import com.mall.common.result.Result;
import com.mall.common.utils.JwtUtils;
import com.mall.user.dto.LoginRequest;
import com.mall.user.entity.User;
import com.mall.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public Result<?> register(@RequestBody LoginRequest request) {
        userService.register(request.getUsername(), request.getPassword());
        return Result.success();
    }

    @PostMapping("/login")
    public Result<Map<String, Object>> login(@RequestBody LoginRequest request) {
        Map<String, Object> result = userService.login(request.getUsername(), request.getPassword());
        return Result.success(result);
    }

    @GetMapping("/info")
    public Result<User> getUserInfo(@RequestHeader("Authorization") String token) {
        Long userId = JwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        User user = userService.getUserInfo(userId);
        return Result.success(user);
    }

    @PutMapping("/info")
    public Result<?> updateUserInfo(@RequestHeader("Authorization") String token, @RequestBody User user) {
        Long userId = JwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        user.setId(userId);
        userService.updateUserInfo(user);
        return Result.success();
    }
}
