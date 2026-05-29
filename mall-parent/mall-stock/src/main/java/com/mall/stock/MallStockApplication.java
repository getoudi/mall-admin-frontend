package com.mall.stock;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@MapperScan("com.mall.stock.mapper")
@ComponentScan(basePackages = {"com.mall.stock", "com.mall.common"})
public class MallStockApplication {

    public static void main(String[] args) {
        SpringApplication.run(MallStockApplication.class, args);
    }
}
