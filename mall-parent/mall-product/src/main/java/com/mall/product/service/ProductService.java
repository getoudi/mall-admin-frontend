package com.mall.product.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mall.product.entity.Category;
import com.mall.product.entity.Product;
import com.mall.product.entity.ProductDetail;

import java.util.List;

public interface ProductService {

    List<Category> getCategoryTree();

    Page<Product> listProducts(Long categoryId, String keyword, String sort, Integer pageNum, Integer pageSize);

    ProductDetail getProductDetail(Long id);
}
