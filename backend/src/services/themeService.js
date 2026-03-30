import pool from '../config/db.js';

export async function list() {
  const [rows] = await pool.query(
    'SELECT * FROM themes WHERE deleted_at IS NULL ORDER BY id'
  );
  return { current_page: 1, data: rows };
}
