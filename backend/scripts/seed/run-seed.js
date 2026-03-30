import 'dotenv/config';
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const API_PATH = path.resolve(__dirname, '../../../frontend/src/app/api');

/** Convert ISO 8601 or date string to MySQL datetime 'YYYY-MM-DD HH:MM:SS' */
function toMySQLDateTime(val) {
  if (val == null || val === '') return null;
  if (typeof val !== 'string') return val;
  try {
    const d = new Date(val);
    if (Number.isNaN(d.getTime())) return null;
    return d.toISOString().slice(0, 19).replace('T', ' ');
  } catch {
    return null;
  }
}

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'multikart',
  multipleStatements: true,
});

async function run() {
  console.log('Seeding from', API_PATH);
  const conn = await pool.getConnection();

  try {
    await seedCurrencies(conn);
    await seedThemes(conn);
    await seedThemeOptions(conn);
    await seedSettings(conn);
    await seedMenu(conn);
    await seedHomeSections(conn);
    await seedCountriesAndStates(conn);
    await seedTaxes(conn);
    await seedAttributes(conn);
    await seedBrands(conn);
    await seedStores(conn);
    await seedCategories(conn);
    await seedProducts(conn);
    await seedPages(conn);
    await seedTags(conn);
    await seedBlogs(conn);
    await seedRolesAndPermissions(conn);
    await seedAdminUser(conn);
    await seedUsers(conn);
    await seedOrderStatuses(conn);
    await seedAddresses(conn);
    await seedOrders(conn);
    await seedCoupons(conn);
    await seedFaqs(conn);
    console.log('Seed completed.');
  } catch (e) {
    console.error('Seed failed:', e);
    throw e;
  } finally {
    conn.release();
    await pool.end();
  }
}

async function seedCurrencies(conn) {
  let data;
  try {
    data = require(path.join(API_PATH, 'currency/currency.json'));
  } catch {
    return;
  }
  const rows = data.data || data;
  const list = Array.isArray(rows) ? rows : [];
  for (const r of list) {
    await conn.query(
      `INSERT IGNORE INTO currencies (id, code, symbol, no_of_decimal, exchange_rate, symbol_position, thousands_separator, decimal_separator, system_reserve, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        r.id,
        r.code,
        r.symbol,
        r.no_of_decimal ?? 2,
        r.exchange_rate ?? 1,
        r.symbol_position || 'before_price',
        r.thousands_separator || 'comma',
        r.decimal_separator || 'comma',
        r.system_reserve ?? 0,
        r.status ?? 1,
        toMySQLDateTime(r.created_at) || toMySQLDateTime(new Date().toISOString()),
        toMySQLDateTime(r.updated_at) || toMySQLDateTime(new Date().toISOString()),
      ]
    );
  }
  console.log('Currencies:', list.length);
}

async function seedThemes(conn) {
  let data;
  try {
    data = require(path.join(API_PATH, 'theme/theme.json'));
  } catch {
    return;
  }
  const rows = data.data || data;
  const list = Array.isArray(rows) ? rows : [];
  for (const r of list) {
    await conn.query(
      `INSERT IGNORE INTO themes (id, name, slug, image, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        r.id,
        r.name,
        r.slug,
        r.image || null,
        r.status ?? 1,
        toMySQLDateTime(r.created_at) || toMySQLDateTime(new Date().toISOString()),
        toMySQLDateTime(r.updated_at) || toMySQLDateTime(new Date().toISOString()),
      ]
    );
  }
  console.log('Themes:', list.length);
}

async function seedThemeOptions(conn) {
  let data;
  try {
    data = require(path.join(API_PATH, 'themeOptions/themeOption.json'));
  } catch {
    return;
  }
  const options = typeof data.options === 'string' ? JSON.parse(data.options) : data.options || {};
  await conn.query(
    'INSERT IGNORE INTO theme_options (id, options) VALUES (1, ?) ON DUPLICATE KEY UPDATE options = VALUES(options)',
    [JSON.stringify(options)]
  );
  console.log('Theme options: 1');
}

async function seedSettings(conn) {
  let data;
  try {
    data = require(path.join(API_PATH, 'settings/setting.json'));
  } catch {
    return;
  }
  const values = data.values || data;
  if (typeof values === 'object') {
    await conn.query('INSERT INTO settings (`key`, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = VALUES(value)', [
      'values',
      JSON.stringify(values),
    ]);
  }
  console.log('Settings: 1');
}

async function seedMenu(conn) {
  let data;
  try {
    data = require(path.join(API_PATH, 'menu/menu.json'));
  } catch {
    return;
  }
  await conn.query(
    'INSERT INTO settings (`key`, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = VALUES(value)',
    ['menu', JSON.stringify(data)]
  );
  console.log('Menu: 1');
}

async function seedHomeSections(conn) {
  const homePath = path.join(API_PATH, 'home');
  let count = 0;
  try {
    const sections = fs.readdirSync(homePath, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
    for (const section of sections) {
      const jsonPath = path.join(homePath, section, `${section}.json`);
      if (!fs.existsSync(jsonPath)) continue;
      try {
        const data = require(jsonPath);
        await conn.query(
          'INSERT INTO settings (`key`, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = VALUES(value)',
          [`home_${section}`, JSON.stringify(data)]
        );
        count++;
      } catch (err) {
        console.warn('Home section skip', section, err.message);
      }
    }
  } catch (e) {
    console.warn('Home sections seed skip:', e.message);
  }
  console.log('Home sections:', count);
}

async function seedCountriesAndStates(conn) {
  let data;
  try {
    data = require(path.join(API_PATH, 'country/state.json'));
  } catch {
    return;
  }
  const list = Array.isArray(data) ? data : [];
  for (const c of list) {
    await conn.query(
      `INSERT IGNORE INTO countries (id, name, currency, currency_symbol, iso_3166_2, iso_3166_3, calling_code, flag)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        c.id,
        c.name,
        c.currency || null,
        c.currency_symbol || null,
        c.iso_3166_2 || null,
        c.iso_3166_3 || null,
        c.calling_code || null,
        c.flag || null,
      ]
    );
    const states = c.state || [];
    for (const s of states) {
      await conn.query(
        'INSERT IGNORE INTO states (id, name, country_id) VALUES (?, ?, ?)',
        [s.id, s.name, s.country_id || c.id]
      );
    }
  }
  console.log('Countries:', list.length);
}

async function seedTaxes(conn) {
  await conn.query(
    "INSERT IGNORE INTO taxes (id, name, rate) VALUES (1, 'Default', 0)"
  );
  console.log('Taxes: 1');
}

async function seedAttributes(conn) {
  let data;
  try {
    data = require(path.join(API_PATH, 'attribute/attribute.json'));
  } catch {
    return;
  }
  const rows = data.data || data;
  const list = Array.isArray(rows) ? rows : [];
  for (const r of list) {
    await conn.query(
      `INSERT IGNORE INTO attributes (id, name, style, slug, status, created_by_id, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        r.id,
        r.name,
        r.style || null,
        r.slug,
        r.status ?? 1,
        r.created_by_id || null,
        toMySQLDateTime(r.created_at) || toMySQLDateTime(new Date().toISOString()),
        toMySQLDateTime(r.updated_at) || toMySQLDateTime(new Date().toISOString()),
      ]
    );
  }
  console.log('Attributes:', list.length);
}

async function seedBrands(conn) {
  let data;
  try {
    data = require(path.join(API_PATH, 'brand/brand.json'));
  } catch {
    return;
  }
  const rows = data.data || data;
  const list = Array.isArray(rows) ? rows : [];
  for (const r of list) {
    await conn.query(
      `INSERT IGNORE INTO brands (id, name, slug, meta_title, meta_description, created_by_id, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        r.id,
        r.name,
        r.slug,
        r.meta_title || null,
        r.meta_description || null,
        r.created_by_id || null,
        r.status ?? 1,
        toMySQLDateTime(r.created_at) || toMySQLDateTime(new Date().toISOString()),
        toMySQLDateTime(r.updated_at) || toMySQLDateTime(new Date().toISOString()),
      ]
    );
  }
  console.log('Brands:', list.length);
}

async function seedStores(conn) {
  let data;
  try {
    data = require(path.join(API_PATH, 'store/store.json'));
  } catch {
    return;
  }
  const rows = data.data || data;
  const list = Array.isArray(rows) ? rows : [];
  for (const r of list) {
    await conn.query(
      `INSERT IGNORE INTO stores (id, name, slug, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        r.id,
        r.name || 'Store',
        r.slug,
        r.status ?? 1,
        toMySQLDateTime(r.created_at) || toMySQLDateTime(new Date().toISOString()),
        toMySQLDateTime(r.updated_at) || toMySQLDateTime(new Date().toISOString()),
      ]
    );
  }
  console.log('Stores:', list.length);
}

function flattenCategories(cats, out = []) {
  if (!Array.isArray(cats)) return out;
  for (const c of cats) {
    out.push(c);
    if (c.subcategories && c.subcategories.length) flattenCategories(c.subcategories, out);
  }
  return out;
}

async function seedCategories(conn) {
  let data;
  try {
    data = require(path.join(API_PATH, 'category/category.json'));
  } catch {
    return;
  }
  const rows = data.data || data;
  const list = Array.isArray(rows) ? rows : [];
  const flat = flattenCategories(list);
  for (const r of flat) {
    await conn.query(
      `INSERT IGNORE INTO categories (id, parent_id, name, slug, description, category_image_id, category_icon_id, type, status, meta_title, meta_description, created_by_id, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        r.id,
        r.parent_id ?? null,
        r.name,
        r.slug,
        r.description || null,
        r.category_image_id ?? null,
        r.category_icon_id ?? null,
        r.type || 'product',
        r.status ?? 1,
        r.meta_title || null,
        r.meta_description || null,
        r.created_by_id || null,
        toMySQLDateTime(r.created_at) || toMySQLDateTime(new Date().toISOString()),
        toMySQLDateTime(r.updated_at) || toMySQLDateTime(new Date().toISOString()),
      ]
    );
  }
  console.log('Categories:', flat.length);
}

async function seedProducts(conn) {
  let data;
  try {
    data = require(path.join(API_PATH, 'product/product.json'));
  } catch (e) {
    console.log('Product seed skip:', e.message);
    return;
  }
  const rows = data.data || data;
  const list = Array.isArray(rows) ? rows : [];
  let inserted = 0;
  for (const r of list.slice(0, 500)) {
    try {
      await conn.query(
        `INSERT IGNORE INTO products (id, name, slug, short_description, description, type, unit, weight, quantity, price, sale_price, discount, is_featured, is_cod, is_free_shipping, is_sale_enable, is_return, is_trending, is_approved, sku, stock_status, meta_title, meta_description, product_thumbnail_id, estimated_delivery_text, return_policy_text, safe_checkout, secure_checkout, social_share, encourage_order, encourage_view, status, store_id, created_by_id, tax_id, product_type, brand_id, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          r.id,
          r.name,
          r.slug,
          r.short_description || null,
          r.description || null,
          r.type || 'simple',
          r.unit || null,
          r.weight ?? 0,
          r.quantity ?? 0,
          r.price ?? 0,
          r.sale_price ?? r.price ?? 0,
          r.discount ?? null,
          r.is_featured ?? 0,
          r.is_cod ?? 0,
          r.is_free_shipping ?? 0,
          r.is_sale_enable ?? 0,
          r.is_return ?? 0,
          r.is_trending ?? 0,
          r.is_approved ?? 1,
          r.sku || null,
          r.stock_status || 'in_stock',
          r.meta_title || null,
          r.meta_description || null,
          r.product_thumbnail_id ?? null,
          r.estimated_delivery_text || null,
          r.return_policy_text || null,
          r.safe_checkout ?? 1,
          r.secure_checkout ?? 1,
          r.social_share ?? 1,
          r.encourage_order ?? 1,
          r.encourage_view ?? 1,
          r.status ?? 1,
          r.store_id ?? null,
          r.created_by_id || null,
          r.tax_id ?? 1,
          r.product_type || 'physical',
          r.brand_id ?? null,
          toMySQLDateTime(r.created_at) || toMySQLDateTime(new Date().toISOString()),
          toMySQLDateTime(r.updated_at) || toMySQLDateTime(new Date().toISOString()),
        ]
      );
      if (r.id) inserted++;
      if (r.categories && Array.isArray(r.categories)) {
        for (const cat of r.categories) {
          const cid = typeof cat === 'object' ? cat.id : cat;
          await conn.query(
            'INSERT IGNORE INTO product_categories (product_id, category_id) VALUES (?, ?)',
            [r.id, cid]
          );
        }
      }
      if (r.variations && Array.isArray(r.variations)) {
        for (const v of r.variations) {
          await conn.query(
            `INSERT IGNORE INTO product_variations (id, product_id, name, price, sale_price, quantity, stock_status, sku, status, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              v.id,
              r.id,
              v.name || null,
              v.price ?? 0,
              v.sale_price ?? v.price ?? 0,
              v.quantity ?? 0,
              v.stock_status || 'in_stock',
              v.sku || null,
              v.status ?? 1,
              toMySQLDateTime(v.created_at) || toMySQLDateTime(new Date().toISOString()),
              toMySQLDateTime(v.updated_at) || toMySQLDateTime(new Date().toISOString()),
            ]
          );
        }
      }
    } catch (err) {
      console.warn('Product insert skip', r.id, err.message);
    }
  }
  console.log('Products:', inserted);
}

async function seedPages(conn) {
  let data;
  try {
    data = require(path.join(API_PATH, 'page/page.json'));
  } catch {
    return;
  }
  const rows = data.data || data;
  const list = Array.isArray(rows) ? rows : [];
  for (const r of list) {
    await conn.query(
      `INSERT IGNORE INTO pages (id, title, slug, content, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        r.id,
        r.title,
        r.slug,
        r.content || null,
        r.status ?? 1,
        toMySQLDateTime(r.created_at) || toMySQLDateTime(new Date().toISOString()),
        toMySQLDateTime(r.updated_at) || toMySQLDateTime(new Date().toISOString()),
      ]
    );
  }
  console.log('Pages:', list.length);
}

async function seedTags(conn) {
  let data;
  try {
    data = require(path.join(API_PATH, 'tag/tag.json'));
  } catch {
    return;
  }
  const rows = data.data || data;
  const list = Array.isArray(rows) ? rows : [];
  for (const r of list) {
    await conn.query(
      `INSERT IGNORE INTO tags (id, name, slug, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?)`,
      [
        r.id,
        r.name,
        r.slug,
        toMySQLDateTime(r.created_at) || toMySQLDateTime(new Date().toISOString()),
        toMySQLDateTime(r.updated_at) || toMySQLDateTime(new Date().toISOString()),
      ]
    );
  }
  console.log('Tags:', list.length);
}

async function seedBlogs(conn) {
  let data;
  try {
    data = require(path.join(API_PATH, 'blog/blog.json'));
  } catch {
    return;
  }
  const rows = data.data || data;
  const list = Array.isArray(rows) ? rows : [];
  for (const r of list.slice(0, 100)) {
    await conn.query(
      `INSERT IGNORE INTO blogs (id, title, slug, content, excerpt, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        r.id,
        r.title,
        r.slug,
        r.content || null,
        r.excerpt || null,
        r.status ?? 1,
        toMySQLDateTime(r.created_at) || toMySQLDateTime(new Date().toISOString()),
        toMySQLDateTime(r.updated_at) || toMySQLDateTime(new Date().toISOString()),
      ]
    );
  }
  console.log('Blogs:', list.length);
}

async function seedRolesAndPermissions(conn) {
  await conn.query(
    "INSERT IGNORE INTO roles (id, name, guard_name, system_reserve) VALUES (1, 'admin', 'web', 1), (2, 'consumer', 'web', 1)"
  );
  const self = require(path.join(API_PATH, 'self/self.json'));
  const perms = self.permission || [];
  for (const p of perms) {
    await conn.query(
      'INSERT IGNORE INTO permissions (id, name, guard_name) VALUES (?, ?, ?)',
      [p.id, p.name, p.guard_name || 'web']
    );
    await conn.query(
      'INSERT IGNORE INTO role_permissions (role_id, permission_id) VALUES (2, ?)',
      [p.id]
    );
  }
  console.log('Roles and permissions ok');
}

async function seedAdminUser(conn) {
  const bcrypt = (await import('bcryptjs')).default;
  const hash = await bcrypt.hash('password', 10);
  await conn.query(
    `INSERT INTO users (id, name, email, password_hash, system_reserve, status, role_id, created_at, updated_at)
     VALUES (1, 'Admin', 'admin@example.com', ?, '0', 1, 1, NOW(), NOW())
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), name = VALUES(name), role_id = 1`,
    [hash]
  );
  const [rolePerms] = await conn.query('SELECT permission_id FROM role_permissions WHERE role_id = 2');
  for (const p of rolePerms) {
    await conn.query(
      'INSERT IGNORE INTO role_permissions (role_id, permission_id) VALUES (1, ?)',
      [p.permission_id]
    );
  }
  console.log('Admin user: admin@example.com / password');
}

async function seedUsers(conn) {
  const bcrypt = (await import('bcryptjs')).default;
  const self = require(path.join(API_PATH, 'self/self.json'));
  const hash = await bcrypt.hash('password', 10);
  await conn.query(
    `INSERT INTO users (id, name, email, password_hash, country_code, phone, system_reserve, status, role_id, created_by_id, email_verified_at, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), name = VALUES(name)`,
    [
      self.id,
      self.name,
      self.email,
      hash,
      self.country_code || null,
      self.phone || null,
      self.system_reserve || '0',
      self.status ?? 1,
      self.role?.id ?? 2,
      self.created_by_id || null,
      toMySQLDateTime(self.email_verified_at),
      toMySQLDateTime(self.created_at) || toMySQLDateTime(new Date().toISOString()),
      toMySQLDateTime(self.updated_at) || toMySQLDateTime(new Date().toISOString()),
    ]
  );
  console.log('Users: 1 (consumer)');
}

async function seedOrderStatuses(conn) {
  let data;
  try {
    data = require(path.join(API_PATH, 'orderStatus/order-status.json'));
  } catch {
    await conn.query(
      "INSERT IGNORE INTO order_statuses (id, name, slug) VALUES (1, 'Pending', 'pending'), (2, 'Processing', 'processing'), (3, 'Delivered', 'delivered'), (4, 'Cancelled', 'cancelled')"
    );
    return;
  }
  const rows = data.data || data;
  const list = Array.isArray(rows) ? rows : [];
  for (const r of list) {
    await conn.query(
      'INSERT IGNORE INTO order_statuses (id, name, slug) VALUES (?, ?, ?)',
      [r.id, r.name, r.slug || r.name?.toLowerCase()]
    );
  }
  console.log('Order statuses:', list.length);
}

async function seedAddresses(conn) {
  const orderData = require(path.join(API_PATH, 'order/order.json'));
  const rows = orderData.data || orderData;
  const list = Array.isArray(rows) ? rows : [];
  const self = require(path.join(API_PATH, 'self/self.json'));
  const seen = new Set();
  for (const o of list.slice(0, 5)) {
    for (const addr of [o.billing_address, o.shipping_address]) {
      if (!addr || seen.has(addr.id)) continue;
      seen.add(addr.id);
      await conn.query(
        `INSERT IGNORE INTO addresses (id, user_id, title, street, city, pincode, state_id, country_id, phone, country_code, is_default)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          addr.id,
          self.id,
          addr.title || null,
          addr.street || null,
          addr.city || null,
          addr.pincode || null,
          addr.state_id ?? (addr.state?.id ?? null),
          addr.country_id ?? (addr.country?.id ?? null),
          addr.phone || null,
          addr.country_code || null,
          addr.is_default ?? 0,
        ]
      );
    }
  }
  console.log('Addresses:', seen.size);
}

async function seedOrders(conn) {
  const orderData = require(path.join(API_PATH, 'order/order.json'));
  const rows = orderData.data || orderData;
  const list = Array.isArray(rows) ? rows : [];
  for (const o of list.slice(0, 20)) {
    await conn.query(
      `INSERT IGNORE INTO orders (id, order_number, consumer_id, tax_total, shipping_total, amount, total, payment_method, payment_status, billing_address_id, shipping_address_id, store_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        o.id,
        o.order_number,
        o.consumer_id,
        o.tax_total ?? 0,
        o.shipping_total ?? 0,
        o.amount ?? 0,
        o.total ?? 0,
        o.payment_method || 'cod',
        o.payment_status || 'PENDING',
        o.billing_address?.id ?? null,
        o.shipping_address?.id ?? null,
        o.store_id ?? null,
      ]
    );
  }
  console.log('Orders:', list.length);
}

async function seedCoupons(conn) {
  let data;
  try {
    data = require(path.join(API_PATH, 'coupon/coupon.json'));
  } catch {
    return;
  }
  const rows = data.data || data;
  const list = Array.isArray(rows) ? rows : [];
  for (const r of list.slice(0, 50)) {
    await conn.query(
      `INSERT IGNORE INTO coupons (id, code, discount_type, discount_value, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        r.id,
        r.code,
        r.discount_type || null,
        r.discount_value ?? null,
        r.status ?? 1,
        toMySQLDateTime(r.created_at) || toMySQLDateTime(new Date().toISOString()),
        toMySQLDateTime(r.updated_at) || toMySQLDateTime(new Date().toISOString()),
      ]
    );
  }
  console.log('Coupons:', list.length);
}

async function seedFaqs(conn) {
  let data;
  try {
    data = require(path.join(API_PATH, 'faq/faq.json'));
  } catch {
    return;
  }
  const rows = data.data || data;
  const list = Array.isArray(rows) ? rows : [];
  for (const r of list) {
    await conn.query(
      `INSERT IGNORE INTO faqs (id, question, answer, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?)`,
      [
        r.id,
        r.question || null,
        r.answer || null,
        toMySQLDateTime(r.created_at) || toMySQLDateTime(new Date().toISOString()),
        toMySQLDateTime(r.updated_at) || toMySQLDateTime(new Date().toISOString()),
      ]
    );
  }
  console.log('Faqs:', list.length);
}

run().catch(() => process.exit(1));
