package com.mall.product.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mall.common.result.Result;
import com.mall.product.entity.Category;
import com.mall.product.entity.Product;
import com.mall.product.entity.ProductDetail;
import com.mall.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/product")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping("/category/tree")
    public Result<List<Category>> getCategoryTree() {
        List<Category> tree = productService.getCategoryTree();
        return Result.success(tree);
    }

    @GetMapping("/list")
    public Result<Page<Product>> listProducts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false, defaultValue = "default") String sort,
            @RequestParam(required = false, defaultValue = "1") Integer pageNum,
            @RequestParam(required = false, defaultValue = "10") Integer pageSize) {
        Page<Product> page = productService.listProducts(categoryId, keyword, sort, pageNum, pageSize);
        return Result.success(page);
    }

    @GetMapping("/detail/{id}")
    public Result<ProductDetail> getProductDetail(@PathVariable Long id) {
        ProductDetail detail = productService.getProductDetail(id);
        return Result.success(detail);
    }
}
