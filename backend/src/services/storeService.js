import pool from '../config/db.js';
import { paginateResponse } from '../utils/paginate.js';

export async function list(query = {}) {
  const page = parseInt(query.page, 10) || 1;
  const paginate = parseInt(query.paginate, 10) || 25;
  const [rows] = await pool.query(
    'SELECT * FROM stores WHERE deleted_at IS NULL ORDER BY id LIMIT ? OFFSET ?',
    [paginate, (page - 1) * paginate]
  );
  const [countResult] = await pool.query(
    'SELECT COUNT(*) AS total FROM stores WHERE deleted_at IS NULL'
  );
  const total = countResult[0]?.total ?? 0;
  return paginateResponse(rows, page, paginate, total);
}

export async function getBySlug(slug) {
  const [rows] = await pool.query(
    'SELECT * FROM stores WHERE slug = ? AND deleted_at IS NULL',
    [slug]
  );
  return rows[0] || null;
}

export async function updateProfile(id, body) {
  const [ex] = await pool.query('SELECT id FROM stores WHERE id = ? AND deleted_at IS NULL', [id]);
  if (!ex.length) return null;
  const { name, slug, status } = body;
  const updates = [];
  const params = [];
  if (name !== undefined) { updates.push('name = ?'); params.push(name); }
  if (slug !== undefined) { updates.push('slug = ?'); params.push(slug); }
  if (status !== undefined) { updates.push('status = ?'); params.push(status); }
  if (updates.length) {
    params.push(id);
    await pool.query(`UPDATE stores SET ${updates.join(', ')} WHERE id = ?`, params);
  }
  const [rows] = await pool.query('SELECT * FROM stores WHERE id = ?', [id]);
  return rows[0] || null;
}
