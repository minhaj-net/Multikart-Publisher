import pool from '../config/db.js';
import { paginateResponse } from '../utils/paginate.js';

export async function list(query) {
  const {
    category,
    brand,
    search,
    sortBy,
    page = 1,
    paginate = 25,
    category_ids,
    ids,
    store_slug,
    status,
  } = query;
  let sql = `
    SELECT p.*, b.id AS brand_id, b.name AS brand_name, b.slug AS brand_slug,
      s.id AS store_id, s.name AS store_name, s.slug AS store_slug
    FROM products p
    LEFT JOIN brands b ON b.id = p.brand_id
    LEFT JOIN stores s ON s.id = p.store_id
    WHERE p.deleted_at IS NULL
  `;
  const params = [];
  if (status != null) {
    sql += ' AND p.status = ?';
    params.push(status);
  }
  if (ids) {
    const idList = ids.split(',').map((i) => i.trim());
    sql += ` AND p.id IN (${idList.map(() => '?').join(',')})`;
    params.push(...idList);
  }
  if (category) {
    const slugs = category.split(',').map((s) => s.trim());
    sql += ` AND EXISTS (SELECT 1 FROM product_categories pc JOIN categories c ON c.id = pc.category_id WHERE pc.product_id = p.id AND c.slug IN (${slugs.map(() => '?').join(',')}))`;
    params.push(...slugs);
  }
  if (category_ids) {
    const cids = category_ids.split(',').map((i) => i.trim());
    sql += ` AND EXISTS (SELECT 1 FROM product_categories pc WHERE pc.product_id = p.id AND pc.category_id IN (${cids.map(() => '?').join(',')}))`;
    params.push(...cids);
  }
  if (brand) {
    const slugs = brand.split(',').map((s) => s.trim());
    sql += ' AND b.slug IN (?' + ',?'.repeat(slugs.length - 1) + ')';
    params.push(...slugs);
  }
  if (store_slug) {
    const slugs = store_slug.split(',').map((s) => s.trim());
    sql += ' AND s.slug IN (?' + ',?'.repeat(slugs.length - 1) + ')';
    params.push(...slugs);
  }
  if (search) {
    sql += ' AND (p.name LIKE ? OR p.short_description LIKE ?)';
    const term = `%${search}%`;
    params.push(term, term);
  }
  const orderBy =
    sortBy === 'desc'
      ? 'p.id DESC'
      : sortBy === 'a-z'
        ? 'p.name ASC'
        : sortBy === 'z-a'
          ? 'p.name DESC'
          : sortBy === 'low-high'
            ? 'p.sale_price ASC'
            : sortBy === 'high-low'
              ? 'p.sale_price DESC'
              : 'p.id ASC';
  sql += ` ORDER BY ${orderBy}`;
  const [allRows] = await pool.query(sql, params);
  const total = allRows.length;
  const perPage = Math.max(1, parseInt(paginate, 10) || 25);
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const offset = (pageNum - 1) * perPage;
  const pageRows = allRows.slice(offset, offset + perPage);
  const withRelations = await Promise.all(
    pageRows.map((row) => enrichProduct(row))
  );
  return paginateResponse(withRelations, pageNum, perPage, total);
}

export async function getBySlugOrId(slugOrId) {
  const isId = /^\d+$/.test(slugOrId);
  const [rows] = await pool.query(
    `SELECT p.*, b.id AS brand_id, b.name AS brand_name, b.slug AS brand_slug,
       s.id AS store_id, s.name AS store_name, s.slug AS store_slug
     FROM products p
     LEFT JOIN brands b ON b.id = p.brand_id
     LEFT JOIN stores s ON s.id = p.store_id
     WHERE p.deleted_at IS NULL AND (p.id = ? OR p.slug = ?)`,
    [slugOrId, slugOrId]
  );
  const row = rows[0];
  if (!row) return null;
  return enrichProduct(row);
}

async function enrichProduct(row) {
  const [categories] = await pool.query(
    `SELECT c.id, c.name, c.slug FROM categories c
     JOIN product_categories pc ON pc.category_id = c.id
     WHERE pc.product_id = ?`,
    [row.id]
  );
  const [variations] = await pool.query('SELECT * FROM product_variations WHERE product_id = ?', [row.id]);
  const product = {
    ...row,
    brand: row.brand_id
      ? { id: row.brand_id, name: row.brand_name, slug: row.brand_slug }
      : null,
    store: row.store_id ? { id: row.store_id, name: row.store_name, slug: row.store_slug } : null,
    categories,
    variations,
    orders_count: 0,
    reviews_count: 0,
    can_review: false,
    order_amount: 0,
    is_wishlist: false,
    rating_count: null,
    review_ratings: [0, 0, 0, 0, 0],
    related_products: [],
    cross_sell_products: [],
    wholesales: [],
  };
  delete product.brand_id;
  delete product.brand_name;
  delete product.brand_slug;
  delete product.store_id;
  delete product.store_name;
  delete product.store_slug;
  return product;
}

export async function approve(id, body) {
  const isApproved = body?.is_approved != null ? Number(body.is_approved) : 1;
  const [r] = await pool.query(
    'UPDATE products SET is_approved = ? WHERE id = ? AND deleted_at IS NULL',
    [isApproved ? 1 : 0, id]
  );
  if (r.affectedRows === 0) return null;
  return getBySlugOrId(String(id));
}
