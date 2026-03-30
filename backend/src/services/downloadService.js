import pool from '../config/db.js';
import { paginateResponse } from '../utils/paginate.js';

export async function list(userId, query = {}) {
  const page = parseInt(query.page, 10) || 1;
  const paginate = parseInt(query.paginate, 10) || 10;
  const [rows] = await pool.query(
    'SELECT * FROM downloads WHERE user_id = ? ORDER BY id DESC LIMIT ? OFFSET ?',
    [userId, paginate, (page - 1) * paginate]
  );
  const [countResult] = await pool.query(
    'SELECT COUNT(*) AS total FROM downloads WHERE user_id = ?',
    [userId]
  );
  const total = countResult[0]?.total ?? 0;
  return paginateResponse(rows, page, paginate, total);
}
