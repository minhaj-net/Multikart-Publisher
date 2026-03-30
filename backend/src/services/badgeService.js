import pool from '../config/db.js';
import { paginateResponse } from '../utils/paginate.js';

export async function list(query = {}) {
  const page = parseInt(query.page, 10) || 1;
  const perPage = parseInt(query.paginate, 10) || 10;
  const [count] = await pool.query('SELECT COUNT(*) AS total FROM badges WHERE deleted_at IS NULL').catch(() => [{ total: 0 }]);
  const total = count[0]?.total ?? 0;
  const [rows] = await pool.query(
    'SELECT * FROM badges WHERE deleted_at IS NULL ORDER BY id LIMIT ? OFFSET ?',
    [perPage, (page - 1) * perPage]
  ).catch(() => [[]]);
  return paginateResponse(rows, page, perPage, total);
}

export async function getById(id) {
  const [rows] = await pool.query('SELECT * FROM badges WHERE id = ? AND deleted_at IS NULL', [id]).catch(() => [[]]);
  return rows[0] || null;
}

export async function create(body) {
  const { name, slug, image_id, status } = body;
  const slugVal = slug || (name && name.toLowerCase().replace(/\s+/g, '-')) || 'badge';
  const [r] = await pool.query(
    'INSERT INTO badges (name, slug, image_id, status) VALUES (?, ?, ?, ?)',
    [name || 'Badge', slugVal, image_id || null, status !== undefined ? status : 1]
  ).catch((e) => {
    if (e.code === 'ER_NO_SUCH_TABLE') throw Object.assign(new Error('Badges table not found. Run schema-admin.sql.'), { statusCode: 500 });
    throw e;
  });
  return getById(r.insertId);
}

export async function update(id, body) {
  const [ex] = await pool.query('SELECT id FROM badges WHERE id = ? AND deleted_at IS NULL', [id]).catch(() => [[]]);
  if (!ex.length) return null;
  const { name, slug, image_id, status } = body;
  const updates = [];
  const params = [];
  if (name !== undefined) { updates.push('name = ?'); params.push(name); }
  if (slug !== undefined) { updates.push('slug = ?'); params.push(slug); }
  if (image_id !== undefined) { updates.push('image_id = ?'); params.push(image_id); }
  if (status !== undefined) { updates.push('status = ?'); params.push(status); }
  if (updates.length) {
    params.push(id);
    await pool.query(`UPDATE badges SET ${updates.join(', ')} WHERE id = ?`, params);
  }
  return getById(id);
}

export async function remove(id) {
  const [r] = await pool.query('UPDATE badges SET deleted_at = NOW() WHERE id = ?', [id]).catch(() => [{ affectedRows: 0 }]);
  return r.affectedRows > 0;
}
