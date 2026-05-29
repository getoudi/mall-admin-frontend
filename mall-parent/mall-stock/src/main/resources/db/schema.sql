CREATE TABLE IF NOT EXISTS `wms_stock` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `sku_id` BIGINT NOT NULL UNIQUE,
  `total_stock` INT NOT NULL DEFAULT 0,
  `available_stock` INT NOT NULL DEFAULT 0,
  `locked_stock` INT NOT NULL DEFAULT 0,
  `version` INT DEFAULT 0,
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 库存锁定记录表
CREATE TABLE IF NOT EXISTS `wms_stock_lock` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `order_sn` VARCHAR(64) NOT NULL,
  `sku_id` BIGINT NOT NULL,
  `quantity` INT NOT NULL,
  `lock_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_order_sku` (`order_sn`, `sku_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 根据商品 SKU 初始化库存
INSERT IGNORE INTO `wms_stock` (`sku_id`, `total_stock`, `available_stock`) VALUES
(1, 100, 100), (2, 80, 80), (3, 50, 50), (4, 120, 120),
(5, 90, 90), (6, 200, 200), (7, 60, 60), (8, 40, 40),
(9, 500, 500), (10, 30, 30);
