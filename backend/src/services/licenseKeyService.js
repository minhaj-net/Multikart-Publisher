import pool from '../config/db.js';
import { paginateResponse } from '../utils/paginate.js';

export async function list(query = {}) {
  const page = parseInt(query.page, 10) || 1;
  const perPage = parseInt(query.paginate, 10) || 10;
  const [count] = await pool.query('SELECT COUNT(*) AS total FROM license_keys WHERE deleted_at IS NULL').catch(() => [{ total: 0 }]);
  const total = count[0]?.total ?? 0;
  const [rows] = await pool.query(
    'SELECT * FROM license_keys WHERE deleted_at IS NULL ORDER BY id DESC LIMIT ? OFFSET ?',
    [perPage, (page - 1) * perPage]
  ).catch(() => [[]]);
  return paginateResponse(rows, page, perPage, total);
}

export async function getById(id) {
  const [rows] = await pool.query('SELECT * FROM license_keys WHERE id = ? AND deleted_at IS NULL', [id]).catch(() => [[]]);
  return rows[0] || null;
}

export async function create(body) {
  const { product_id, order_id, license_key, status } = body;
  if (!license_key) throw Object.assign(new Error('license_key required'), { statusCode: 400 });
  const [r] = await pool.query(
    'INSERT INTO license_keys (product_id, order_id, license_key, status) VALUES (?, ?, ?, ?)',
    [product_id || null, order_id || null, license_key, status !== undefined ? status : 1]
  ).catch((e) => {
    if (e.code === 'ER_NO_SUCH_TABLE') throw Object.assign(new Error('license_keys table not found. Run schema-admin.sql.'), { statusCode: 500 });
    throw e;
  });
  return getById(r.insertId);
}

export async function update(id, body) {
  const [ex] = await pool.query('SELECT id FROM license_keys WHERE id = ? AND deleted_at IS NULL', [id]).catch(() => [[]]);
  if (!ex.length) return null;
  const { license_key, status } = body;
  const updates = [];
  const params = [];
  if (license_key !== undefined) { updates.push('license_key = ?'); params.push(license_key); }
  if (status !== undefined) { updates.push('status = ?'); params.push(status); }
  if (updates.length) {
    params.push(id);
    await pool.query(`UPDATE license_keys SET ${updates.join(', ')} WHERE id = ?`, params);
  }
  return getById(id);
}

export async function remove(id) {
  const [r] = await pool.query('UPDATE license_keys SET deleted_at = NOW() WHERE id = ?', [id]).catch(() => [{ affectedRows: 0 }]);
  return r.affectedRows > 0;
}
