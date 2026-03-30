import pool from '../config/db.js';
import { paginateResponse } from '../utils/paginate.js';

export async function list(query = {}) {
  const page = parseInt(query.page, 10) || 1;
  const paginate = parseInt(query.paginate, 10) || 10;
  let sql = 'SELECT * FROM reviews WHERE deleted_at IS NULL';
  const params = [];
  if (query.product_id) {
    sql += ' AND product_id = ?';
    params.push(query.product_id);
  }
  sql += ' ORDER BY id DESC LIMIT ? OFFSET ?';
  params.push(paginate, (page - 1) * paginate);
  const [rows] = await pool.query(sql, params);
  const [countResult] = await pool.query(
    'SELECT COUNT(*) AS total FROM reviews WHERE deleted_at IS NULL' +
      (query.product_id ? ' AND product_id = ?' : ''),
    query.product_id ? [query.product_id] : []
  );
  const total = countResult[0]?.total ?? 0;
  return paginateResponse(rows, page, paginate, total);
}

export async function create(userId, body) {
  const { product_id, rating, comment } = body;
  if (!product_id || !rating) throw Object.assign(new Error('product_id and rating required'), { statusCode: 400 });
  const [ins] = await pool.query(
    'INSERT INTO reviews (user_id, product_id, rating, comment) VALUES (?, ?, ?, ?)',
    [userId, product_id, rating, comment || null]
  );
  const [rows] = await pool.query('SELECT * FROM reviews WHERE id = ?', [ins.insertId]);
  return rows[0];
}
