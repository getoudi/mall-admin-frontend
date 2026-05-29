package com.mall.product.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mall.product.entity.Category;
import com.mall.product.entity.Product;
import com.mall.product.entity.ProductDetail;
import com.mall.product.entity.Sku;
import com.mall.product.mapper.CategoryMapper;
import com.mall.product.mapper.ProductMapper;
import com.mall.product.mapper.SkuMapper;
import com.mall.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final CategoryMapper categoryMapper;
    private final ProductMapper productMapper;
    private final SkuMapper skuMapper;
    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    @Override
    public List<Category> getCategoryTree() {
        LambdaQueryWrapper<Category> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Category::getStatus, 1)
                .orderByAsc(Category::getSort);
        List<Category> allCategories = categoryMapper.selectList(wrapper);
        return buildTree(allCategories, 0L);
    }

    @Override
    public Page<Product> listProducts(Long categoryId, String keyword, String sort, Integer pageNum, Integer pageSize) {
        Page<Product> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<Product> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Product::getStatus, 1);

        if (categoryId != null) {
            wrapper.eq(Product::getCategoryId, categoryId);
        }
        if (keyword != null && !keyword.isEmpty()) {
            wrapper.like(Product::getName, keyword);
        }

        switch (sort != null ? sort : "default") {
            case "sales" -> wrapper.orderByDesc(Product::getSales);
            case "price_asc" -> wrapper.orderByAsc(Product::getPrice);
            case "price_desc" -> wrapper.orderByDesc(Product::getPrice);
            default -> wrapper.orderByAsc(Product::getSort);
        }

        return productMapper.selectPage(page, wrapper);
    }

    @Override
    public ProductDetail getProductDetail(Long id) {
        String cacheKey = "product:detail:" + id;
        String cached = redisTemplate.opsForValue().get(cacheKey);
        if (cached != null) {
            try {
                return objectMapper.readValue(cached, ProductDetail.class);
            } catch (JsonProcessingException e) {
                redisTemplate.delete(cacheKey);
            }
        }

        Product product = productMapper.selectById(id);
        if (product == null) {
            return null;
        }

        LambdaQueryWrapper<Sku> skuWrapper = new LambdaQueryWrapper<>();
        skuWrapper.eq(Sku::getProductId, id);
        List<Sku> skuList = skuMapper.selectList(skuWrapper);

        ProductDetail detail = new ProductDetail();
        detail.setProduct(product);
        detail.setSkuList(skuList);

        try {
            String json = objectMapper.writeValueAsString(detail);
            redisTemplate.opsForValue().set(cacheKey, json, 1, TimeUnit.HOURS);
        } catch (JsonProcessingException e) {
            // 缓存写入失败不影响主流程
        }

        return detail;
    }

    private List<Category> buildTree(List<Category> allCategories, Long parentId) {
        return allCategories.stream()
                .filter(c -> c.getParentId().equals(parentId))
                .peek(c -> c.setChildren(buildTree(allCategories, c.getId())))
                .collect(Collectors.toList());
    }
}
