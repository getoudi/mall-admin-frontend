package com.mall.user.service;

import com.mall.user.entity.User;

import java.util.Map;

public interface UserService {

    void register(String username, String password);

    Map<String, Object> login(String username, String password);

    User getUserInfo(Long userId);

    void updateUserInfo(User user);
}
