CREATE TABLE IF NOT EXISTS `oms_order` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `order_sn` VARCHAR(64) NOT NULL UNIQUE,
  `user_id` BIGINT NOT NULL,
  `total_amount` DECIMAL(10,2) NOT NULL,
  `freight_amount` DECIMAL(10,2) DEFAULT 0,
  `pay_amount` DECIMAL(10,2) NOT NULL,
  `status` TINYINT DEFAULT 0 COMMENT '0待付款 1待发货 2待收货 3已完成 4已取消',
  `receiver_name` VARCHAR(50) NOT NULL,
  `receiver_phone` VARCHAR(20) NOT NULL,
  `receiver_address` VARCHAR(500) NOT NULL,
  `remark` VARCHAR(500) DEFAULT '',
  `pay_time` DATETIME DEFAULT NULL,
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `oms_order_item` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `order_id` BIGINT NOT NULL,
  `sku_id` BIGINT NOT NULL,
  `sku_name` VARCHAR(200) NOT NULL,
  `sku_image` VARCHAR(255) DEFAULT '',
  `price` DECIMAL(10,2) NOT NULL,
  `quantity` INT NOT NULL,
  `total_amount` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 测试数据
INSERT INTO `oms_order` (`order_sn`, `user_id`, `total_amount`, `freight_amount`, `pay_amount`, `status`, `receiver_name`, `receiver_phone`, `receiver_address`, `remark`) VALUES
('ORD20260517001', 1, 18998.00, 0.00, 18998.00, 0, '张三', '13800138000', '北京市朝阳区xxx街道', '请尽快发货'),
('ORD20260517002', 1, 3999.00, 6.00, 4005.00, 2, '张三', '13800138000', '北京市朝阳区xxx街道', '');
