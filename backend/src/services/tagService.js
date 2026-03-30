import pool from '../config/db.js';
import { paginateResponse } from '../utils/paginate.js';

export async function list(query = {}) {
  const page = parseInt(query.page, 10) || 1;
  const paginate = parseInt(query.paginate, 10) || 25;
  const [rows] = await pool.query(
    'SELECT * FROM tags WHERE deleted_at IS NULL ORDER BY id LIMIT ? OFFSET ?',
    [paginate, (page - 1) * paginate]
  );
  const [countResult] = await pool.query(
    'SELECT COUNT(*) AS total FROM tags WHERE deleted_at IS NULL'
  );
  const total = countResult[0]?.total ?? 0;
  return paginateResponse(rows, page, paginate, total);
}
