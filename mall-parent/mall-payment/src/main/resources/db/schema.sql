CREATE TABLE IF NOT EXISTS `pms_payment` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `order_sn` VARCHAR(64) NOT NULL,
  `payment_sn` VARCHAR(64) NOT NULL UNIQUE,
  `user_id` BIGINT NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `pay_type` TINYINT NOT NULL COMMENT '1支付宝 2微信',
  `status` TINYINT DEFAULT 0 COMMENT '0待支付 1已支付 2失败',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `pay_time` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 测试数据
INSERT INTO `pms_payment` (`order_sn`, `payment_sn`, `user_id`, `amount`, `pay_type`, `status`) VALUES
('ORD20260517001', 'PAY20260517001001', 1, 18998.00, 1, 0),
('ORD20260517002', 'PAY20260517002001', 1, 4005.00, 2, 1);
