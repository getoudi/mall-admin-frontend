CREATE TABLE IF NOT EXISTS `oms_cart_item` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `sku_id` BIGINT NOT NULL,
  `product_id` BIGINT NOT NULL,
  `sku_name` VARCHAR(200) NOT NULL,
  `sku_image` VARCHAR(255) DEFAULT '',
  `price` DECIMAL(10,2) NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `checked` TINYINT DEFAULT 1,
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_sku` (`user_id`, `sku_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 测试数据
INSERT INTO `oms_cart_item` (`user_id`, `sku_id`, `product_id`, `sku_name`, `sku_image`, `price`, `quantity`, `checked`) VALUES
(1, 1, 1, 'iPhone 15 Pro 256GB 黑色', 'https://example.com/iphone15pro-black.jpg', 8999.00, 1, 1),
(1, 3, 1, 'iPhone 15 Pro 512GB 白色', 'https://example.com/iphone15pro-white.jpg', 10999.00, 2, 1),
(2, 5, 2, '小米14 12GB+256GB 黑色', 'https://example.com/xiaomi14-black.jpg', 3999.00, 1, 1),
(2, 8, 3, 'MacBook Air M3 8GB+256GB', 'https://example.com/macbook-air-m3.jpg', 8999.00, 1, 0);
