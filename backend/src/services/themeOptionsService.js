import pool from '../config/db.js';

export async function get() {
  const [rows] = await pool.query(
    'SELECT id, options FROM theme_options WHERE deleted_at IS NULL LIMIT 1'
  );
  const row = rows[0];
  if (!row) return { id: 1, options: {} };
  const options = typeof row.options === 'string' ? JSON.parse(row.options) : row.options;
  return { id: row.id, options };
}
