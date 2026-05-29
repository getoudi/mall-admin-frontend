CREATE TABLE IF NOT EXISTS `pms_category` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `parent_id` BIGINT DEFAULT 0,
  `level` TINYINT NOT NULL,
  `sort` INT DEFAULT 0,
  `icon` VARCHAR(255) DEFAULT '',
  `status` TINYINT DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `pms_product` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(200) NOT NULL,
  `category_id` BIGINT NOT NULL,
  `brand_id` BIGINT DEFAULT 0,
  `description` TEXT,
  `main_image` VARCHAR(255) DEFAULT '',
  `images` TEXT COMMENT '多张图片逗号分隔',
  `price` DECIMAL(10,2) NOT NULL,
  `original_price` DECIMAL(10,2) DEFAULT NULL,
  `sales` INT DEFAULT 0,
  `status` TINYINT DEFAULT 1,
  `sort` INT DEFAULT 0,
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `pms_sku` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `product_id` BIGINT NOT NULL,
  `name` VARCHAR(200) NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `stock` INT NOT NULL DEFAULT 0,
  `specs` VARCHAR(500) DEFAULT '' COMMENT '规格：颜色:黑色;尺码:XL',
  `image` VARCHAR(255) DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `idx_product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 插入测试分类
INSERT IGNORE INTO `pms_category` VALUES
(1, '手机数码', 0, 1, 1, '', 1),
(2, '电脑办公', 0, 1, 2, '', 1),
(3, '家用电器', 0, 1, 3, '', 1),
(4, '手机', 1, 2, 1, '', 1),
(5, '平板', 1, 2, 2, '', 1),
(6, '笔记本', 2, 2, 1, '', 1),
(7, '配件', 1, 2, 3, '', 1);

-- 插入测试商品
INSERT IGNORE INTO `pms_product` VALUES
(1, 'iPhone 15 Pro Max 256GB', 4, 0, '苹果最新旗舰', 'https://picsum.photos/400/400?random=1', 'https://picsum.photos/400/400?random=1,https://picsum.photos/400/400?random=2', 9999.00, 10999.00, 2341, 1, 1, NOW(), NOW()),
(2, '华为 Mate 60 Pro', 4, 0, '华为旗舰手机', 'https://picsum.photos/400/400?random=3', 'https://picsum.photos/400/400?random=3,https://picsum.photos/400/400?random=4', 6999.00, 7999.00, 1892, 1, 2, NOW(), NOW()),
(3, '小米14 Ultra', 4, 0, '小米影像旗舰', 'https://picsum.photos/400/400?random=5', 'https://picsum.photos/400/400?random=5,https://picsum.photos/400/400?random=6', 5999.00, 6499.00, 3210, 1, 3, NOW(), NOW()),
(4, 'iPad Pro 12.9英寸', 5, 0, '苹果平板电脑', 'https://picsum.photos/400/400?random=7', 'https://picsum.photos/400/400?random=7,https://picsum.photos/400/400?random=8', 8999.00, 9999.00, 987, 1, 4, NOW(), NOW()),
(5, 'MacBook Pro 14英寸', 6, 0, '苹果笔记本电脑', 'https://picsum.photos/400/400?random=9', 'https://picsum.photos/400/400?random=9,https://picsum.photos/400/400?random=10', 14999.00, 16999.00, 1567, 1, 5, NOW(), NOW()),
(6, '联想 ThinkPad X1 Carbon', 6, 0, '商务轻薄笔记本', 'https://picsum.photos/400/400?random=11', 'https://picsum.photos/400/400?random=11,https://picsum.photos/400/400?random=12', 8999.00, 9999.00, 876, 1, 6, NOW(), NOW()),
(7, 'AirPods Pro 2', 7, 0, '苹果降噪耳机', 'https://picsum.photos/400/400?random=13', 'https://picsum.photos/400/400?random=13,https://picsum.photos/400/400?random=14', 1799.00, 1999.00, 5621, 1, 7, NOW(), NOW()),
(8, '索尼 WH-1000XM5', 7, 0, '索尼头戴降噪耳机', 'https://picsum.photos/400/400?random=15', 'https://picsum.photos/400/400?random=15,https://picsum.photos/400/400?random=16', 2299.00, 2699.00, 3456, 1, 8, NOW(), NOW()),
(9, '戴森 V15 吸尘器', 3, 0, '戴森旗舰吸尘器', 'https://picsum.photos/400/400?random=17', 'https://picsum.photos/400/400?random=17,https://picsum.photos/400/400?random=18', 4490.00, 5490.00, 1234, 1, 9, NOW(), NOW()),
(10, '海尔冰箱 BCD-500', 3, 0, '海尔大容量冰箱', 'https://picsum.photos/400/400?random=19', 'https://picsum.photos/400/400?random=19,https://picsum.photos/400/400?random=20', 3999.00, 4599.00, 789, 1, 10, NOW(), NOW());

-- 插入测试 SKU
INSERT IGNORE INTO `pms_sku` VALUES
(1, 1, 'iPhone 15 Pro Max 256GB 暗夜蓝', 9999.00, 100, '颜色:暗夜蓝;存储:256GB', 'https://picsum.photos/400/400?random=1'),
(2, 1, 'iPhone 15 Pro Max 256GB 银色', 9999.00, 80, '颜色:银色;存储:256GB', 'https://picsum.photos/400/400?random=2'),
(3, 1, 'iPhone 15 Pro Max 512GB 暗夜蓝', 10999.00, 50, '颜色:暗夜蓝;存储:512GB', 'https://picsum.photos/400/400?random=1'),
(4, 2, '华为 Mate 60 Pro 雅丹黑', 6999.00, 120, '颜色:雅丹黑;存储:256GB', 'https://picsum.photos/400/400?random=3'),
(5, 2, '华为 Mate 60 Pro 雅川青', 6999.00, 90, '颜色:雅川青;存储:256GB', 'https://picsum.photos/400/400?random=4'),
(6, 3, '小米14 Ultra 黑色 16+512', 5999.00, 200, '颜色:黑色;存储:16+512GB', 'https://picsum.photos/400/400?random=5'),
(7, 4, 'iPad Pro 12.9 256GB WiFi', 8999.00, 60, '颜色:深空灰;存储:256GB;网络:WiFi', 'https://picsum.photos/400/400?random=7'),
(8, 5, 'MacBook Pro 14 M3 Pro 18+512', 14999.00, 40, '芯片:M3 Pro;内存:18GB;存储:512GB', 'https://picsum.photos/400/400?random=9'),
(9, 7, 'AirPods Pro 2 USB-C', 1799.00, 500, '版本:USB-C', 'https://picsum.photos/400/400?random=13'),
(10, 9, '戴森 V15 金色', 4490.00, 30, '颜色:金色', 'https://picsum.photos/400/400?random=17');
