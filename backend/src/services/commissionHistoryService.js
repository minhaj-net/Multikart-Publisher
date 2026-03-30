import pool from '../config/db.js';
import { paginateResponse } from '../utils/paginate.js';

export async function list(query = {}) {
  const page = parseInt(query.page, 10) || 1;
  const perPage = parseInt(query.paginate, 10) || 10;
  let total = 0;
  let rows = [];
  try {
    const [count] = await pool.query('SELECT COUNT(*) AS total FROM commission_history');
    total = count[0]?.total ?? 0;
    const [r] = await pool.query(
      'SELECT * FROM commission_history ORDER BY id DESC LIMIT ? OFFSET ?',
      [perPage, (page - 1) * perPage]
    );
    rows = r;
  } catch (_) {}
  return paginateResponse(rows, page, perPage, total);
}
