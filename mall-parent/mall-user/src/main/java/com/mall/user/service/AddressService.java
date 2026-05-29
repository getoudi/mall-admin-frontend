package com.mall.user.service;

import com.mall.user.entity.Address;

import java.util.List;

public interface AddressService {

    List<Address> listByUserId(Long userId);

    void add(Address address);

    void update(Address address);

    void delete(Long id, Long userId);

    void setDefault(Long id, Long userId);
}
