import pool from '../config/db.js';
import { paginateResponse } from '../utils/paginate.js';
import * as productService from './productService.js';

export async function list(consumerId, query = {}) {
  const page = parseInt(query.page, 10) || 1;
  const paginate = parseInt(query.paginate, 10) || 25;
  const [rows] = await pool.query(
    `SELECT w.*, p.name, p.slug, p.sale_price, p.product_thumbnail_id FROM wishlists w
     JOIN products p ON p.id = w.product_id
     WHERE w.consumer_id = ? AND w.deleted_at IS NULL
     ORDER BY w.id LIMIT ? OFFSET ?`,
    [consumerId, paginate, (page - 1) * paginate]
  );
  const [countResult] = await pool.query(
    'SELECT COUNT(*) AS total FROM wishlists WHERE consumer_id = ? AND deleted_at IS NULL',
    [consumerId]
  );
  const total = countResult[0]?.total ?? 0;
  const data = await Promise.all(rows.map((r) => productService.getBySlugOrId(r.product_id)));
  return paginateResponse(data, page, paginate, total);
}

export async function add(consumerId, body) {
  const { product_id } = body;
  if (!product_id) throw Object.assign(new Error('product_id required'), { statusCode: 400 });
  await pool.query(
    'INSERT IGNORE INTO wishlists (consumer_id, product_id) VALUES (?, ?)',
    [consumerId, product_id]
  );
  return list(consumerId, {});
}

export async function remove(consumerId, id) {
  await pool.query(
    'UPDATE wishlists SET deleted_at = NOW() WHERE id = ? AND consumer_id = ?',
    [id, consumerId]
  );
}
