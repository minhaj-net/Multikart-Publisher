import pool from '../config/db.js';
import { paginateResponse } from '../utils/paginate.js';

export async function list(query = {}) {
  const page = parseInt(query.page, 10) || 1;
  const paginate = parseInt(query.paginate, 10) || 25;
  let sql = 'SELECT * FROM coupons WHERE deleted_at IS NULL';
  const params = [];
  if (query.status != null) {
    sql += ' AND status = ?';
    params.push(query.status);
  }
  sql += ' ORDER BY id LIMIT ? OFFSET ?';
  params.push(paginate, (page - 1) * paginate);
  const [rows] = await pool.query(sql, params);
  const [countResult] = await pool.query(
    'SELECT COUNT(*) AS total FROM coupons WHERE deleted_at IS NULL' +
      (query.status != null ? ' AND status = ?' : ''),
    query.status != null ? [query.status] : []
  );
  const total = countResult[0]?.total ?? 0;
  return paginateResponse(rows, page, paginate, total);
}

export async function validate(body) {
  const { code } = body;
  if (!code) throw Object.assign(new Error('code required'), { statusCode: 400 });
  const [rows] = await pool.query(
    'SELECT * FROM coupons WHERE code = ? AND status = 1 AND deleted_at IS NULL',
    [code]
  );
  return rows[0] || { valid: false, message: 'Invalid coupon' };
}
