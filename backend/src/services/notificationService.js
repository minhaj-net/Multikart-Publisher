import pool from '../config/db.js';
import { paginateResponse } from '../utils/paginate.js';

export async function list(userId, query = {}) {
  const page = parseInt(query.page, 10) || 1;
  const paginate = parseInt(query.paginate, 10) || 10;
  const [rows] = await pool.query(
    'SELECT * FROM notifications WHERE user_id = ? ORDER BY id DESC LIMIT ? OFFSET ?',
    [userId, paginate, (page - 1) * paginate]
  );
  const [countResult] = await pool.query(
    'SELECT COUNT(*) AS total FROM notifications WHERE user_id = ?',
    [userId]
  );
  const total = countResult[0]?.total ?? 0;
  return paginateResponse(rows, page, paginate, total);
}

export async function markAsRead(userId, body) {
  const ids = body?.ids;
  if (Array.isArray(ids) && ids.length)
    await pool.query(
      'UPDATE notifications SET read_at = NOW() WHERE user_id = ? AND id IN (?)',
      [userId, ids]
    );
  else
    await pool.query('UPDATE notifications SET read_at = NOW() WHERE user_id = ?', [userId]);
}
