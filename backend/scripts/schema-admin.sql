-- Admin-only tables (run after schema.sql)
-- Run: mysql -u root -p multikart < scripts/schema-admin.sql

SET FOREIGN_KEY_CHECKS = 0;

-- Shipping zones (per country)
CREATE TABLE IF NOT EXISTS shipping_zones (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  country_id INT UNSIGNED NULL,
  status TINYINT DEFAULT 1,
  created_by_id VARCHAR(20) NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  KEY idx_shipping_country (country_id)
) ENGINE=InnoDB;

-- Shipping rules (per zone)
CREATE TABLE IF NOT EXISTS shipping_rules (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  shipping_zone_id INT UNSIGNED NOT NULL,
  name VARCHAR(100) NULL,
  min_order DECIMAL(14,2) DEFAULT 0,
  max_order DECIMAL(14,2) NULL,
  rate DECIMAL(14,2) DEFAULT 0,
  status TINYINT DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  KEY idx_shipping_rules_zone (shipping_zone_id)
) ENGINE=InnoDB;

-- Notices (admin announcements)
CREATE TABLE IF NOT EXISTS notices (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NULL,
  body TEXT NULL,
  read_at DATETIME NULL,
  created_by_id INT UNSIGNED NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  KEY idx_notices_created (created_at)
) ENGINE=InnoDB;

-- Notice reads (which user read which notice)
CREATE TABLE IF NOT EXISTS notice_reads (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  notice_id INT UNSIGNED NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  read_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_notice_user (notice_id, user_id)
) ENGINE=InnoDB;

-- Badges
CREATE TABLE IF NOT EXISTS badges (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  image_id INT UNSIGNED NULL,
  status TINYINT DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  UNIQUE KEY uk_badges_slug (slug)
) ENGINE=InnoDB;

-- Withdraw requests (vendor)
CREATE TABLE IF NOT EXISTS withdraw_requests (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  amount DECIMAL(14,2) NOT NULL,
  status VARCHAR(30) DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  KEY idx_withdraw_user (user_id)
) ENGINE=InnoDB;

-- License keys (for digital products)
CREATE TABLE IF NOT EXISTS license_keys (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_id INT UNSIGNED NULL,
  order_id INT UNSIGNED NULL,
  license_key VARCHAR(255) NOT NULL,
  status TINYINT DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  KEY idx_license_product (product_id)
) ENGINE=InnoDB;

-- Commission history
CREATE TABLE IF NOT EXISTS commission_history (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id INT UNSIGNED NULL,
  store_id INT UNSIGNED NULL,
  amount DECIMAL(14,2) DEFAULT 0,
  rate DECIMAL(8,4) NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY idx_commission_order (order_id),
  KEY idx_commission_store (store_id)
) ENGINE=InnoDB;

-- Optional: add status/created_by_id to taxes (run only if your taxes table lacks them)
-- ALTER TABLE taxes ADD COLUMN status TINYINT DEFAULT 1;
-- ALTER TABLE taxes ADD COLUMN created_by_id VARCHAR(20) NULL;

SET FOREIGN_KEY_CHECKS = 1;
