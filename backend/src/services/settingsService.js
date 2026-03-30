import pool from '../config/db.js';

export async function get() {
  const [rows] = await pool.query(
    "SELECT value FROM settings WHERE `key` = 'values' AND deleted_at IS NULL LIMIT 1"
  );
  const row = rows[0];
  if (!row) return { values: {} };
  const values = typeof row.value === 'string' ? JSON.parse(row.value) : row.value;
  return { values: values || {} };
}
