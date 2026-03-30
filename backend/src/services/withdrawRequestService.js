import pool from '../config/db.js';
import { paginateResponse } from '../utils/paginate.js';

export async function list(query = {}) {
  const page = parseInt(query.page, 10) || 1;
  const perPage = parseInt(query.paginate, 10) || 10;
  let sql = 'SELECT * FROM withdraw_requests WHERE deleted_at IS NULL ORDER BY id DESC';
  const params = [];
  const [count] = await pool.query('SELECT COUNT(*) AS total FROM withdraw_requests WHERE deleted_at IS NULL').catch(() => [{ total: 0 }]);
  const total = count[0]?.total ?? 0;
  const [rows] = await pool.query(
    `${sql} LIMIT ? OFFSET ?`,
    [...params, perPage, (page - 1) * perPage]
  ).catch(() => [[]]);
  return paginateResponse(rows, page, perPage, total);
}

export async function getById(id) {
  const [rows] = await pool.query('SELECT * FROM withdraw_requests WHERE id = ? AND deleted_at IS NULL', [id]).catch(() => [[]]);
  return rows[0] || null;
}

export async function create(body) {
  const { user_id, amount } = body;
  if (!user_id || amount == null) throw Object.assign(new Error('user_id and amount required'), { statusCode: 400 });
  const [r] = await pool.query(
    'INSERT INTO withdraw_requests (user_id, amount, status) VALUES (?, ?, ?)',
    [user_id, Number(amount), 'pending']
  ).catch((e) => {
    if (e.code === 'ER_NO_SUCH_TABLE') throw Object.assign(new Error('withdraw_requests table not found. Run schema-admin.sql.'), { statusCode: 500 });
    throw e;
  });
  return getById(r.insertId);
}

export async function update(id, body) {
  const [ex] = await pool.query('SELECT id FROM withdraw_requests WHERE id = ? AND deleted_at IS NULL', [id]).catch(() => [[]]);
  if (!ex.length) return null;
  const { status } = body;
  if (status !== undefined) {
    await pool.query('UPDATE withdraw_requests SET status = ? WHERE id = ?', [status, id]);
  }
  return getById(id);
}
