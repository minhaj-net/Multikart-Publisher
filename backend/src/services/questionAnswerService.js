import pool from '../config/db.js';
import { paginateResponse } from '../utils/paginate.js';

export async function list(query = {}) {
  const page = parseInt(query.page, 10) || 1;
  const paginate = parseInt(query.paginate, 10) || 10;
  let sql = 'SELECT q.* FROM question_answers q WHERE q.deleted_at IS NULL';
  const params = [];
  if (query.product_id) {
    sql += ' AND q.product_id = ?';
    params.push(query.product_id);
  }
  sql += ' ORDER BY q.id DESC LIMIT ? OFFSET ?';
  params.push(paginate, (page - 1) * paginate);
  const [rows] = await pool.query(sql, params);
  const [countResult] = await pool.query(
    'SELECT COUNT(*) AS total FROM question_answers WHERE deleted_at IS NULL' +
      (query.product_id ? ' AND product_id = ?' : ''),
    query.product_id ? [query.product_id] : []
  );
  const total = countResult[0]?.total ?? 0;
  return paginateResponse(rows, page, paginate, total);
}

export async function create(userId, body) {
  const { product_id, question } = body;
  if (!product_id || !question) throw Object.assign(new Error('product_id and question required'), { statusCode: 400 });
  const [ins] = await pool.query(
    'INSERT INTO question_answers (user_id, product_id, question) VALUES (?, ?, ?)',
    [userId, product_id, question]
  );
  const [rows] = await pool.query('SELECT * FROM question_answers WHERE id = ?', [ins.insertId]);
  return rows[0];
}

export async function feedback(userId, body) {
  return { message: 'Thank you for your feedback' };
}
