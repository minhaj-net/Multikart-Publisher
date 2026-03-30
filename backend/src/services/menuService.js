import pool from '../config/db.js';

export async function get() {
  const [rows] = await pool.query(
    "SELECT value FROM settings WHERE `key` = 'menu' AND deleted_at IS NULL LIMIT 1"
  );
  const row = rows[0];
  if (!row || !row.value) {
    return { current_page: 1, data: [] };
  }
  const data = typeof row.value === 'string' ? JSON.parse(row.value) : row.value;
  return data && typeof data === 'object' ? data : { current_page: 1, data: [] };
}

export async function sort(body) {
  const order = body?.order || body?.data || body;
  const value = JSON.stringify(Array.isArray(order) ? order : order);
  await pool.query(
    "INSERT INTO settings (`key`, value) VALUES ('menu', ?) ON DUPLICATE KEY UPDATE value = ?",
    [value, value]
  );
  return get();
}
