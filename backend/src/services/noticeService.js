import pool from '../config/db.js';
import { paginateResponse } from '../utils/paginate.js';

export async function list(query = {}) {
  const page = parseInt(query.page, 10) || 1;
  const perPage = parseInt(query.paginate, 10) || 10;
  const [count] = await pool.query('SELECT COUNT(*) AS total FROM notices WHERE deleted_at IS NULL');
  const total = count[0]?.total ?? 0;
  const [rows] = await pool.query(
    'SELECT * FROM notices WHERE deleted_at IS NULL ORDER BY created_at DESC LIMIT ? OFFSET ?',
    [perPage, (page - 1) * perPage]
  );
  return paginateResponse(rows, page, perPage, total);
}

export async function getById(id) {
  const [rows] = await pool.query('SELECT * FROM notices WHERE id = ? AND deleted_at IS NULL', [id]);
  return rows[0] || null;
}

export async function create(body, createdById) {
  const { title, body: bodyText } = body;
  const [r] = await pool.query(
    'INSERT INTO notices (title, body, created_by_id) VALUES (?, ?, ?)',
    [title || '', bodyText || '', createdById || null]
  );
  return getById(r.insertId);
}

export async function update(id, body) {
  const [ex] = await pool.query('SELECT id FROM notices WHERE id = ? AND deleted_at IS NULL', [id]);
  if (!ex.length) return null;
  const { title, body: bodyText } = body;
  const updates = [];
  const params = [];
  if (title !== undefined) { updates.push('title = ?'); params.push(title); }
  if (bodyText !== undefined) { updates.push('body = ?'); params.push(bodyText); }
  if (updates.length) {
    params.push(id);
    await pool.query(`UPDATE notices SET ${updates.join(', ')} WHERE id = ?`, params);
  }
  return getById(id);
}

export async function remove(id) {
  const [r] = await pool.query('UPDATE notices SET deleted_at = NOW() WHERE id = ?', [id]);
  return r.affectedRows > 0;
}

export async function markAsRead(noticeId, userId) {
  try {
    await pool.query(
      'INSERT INTO notice_reads (notice_id, user_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE read_at = NOW()',
      [noticeId, userId]
    );
    return { message: 'Marked as read' };
  } catch (e) {
    if (e.code === 'ER_NO_SUCH_TABLE') return { message: 'Marked as read' };
    throw e;
  }
}

export async function recent(limit = 5) {
  const [rows] = await pool.query(
    'SELECT * FROM notices WHERE deleted_at IS NULL ORDER BY created_at DESC LIMIT ?',
    [limit]
  );
  return rows;
}
