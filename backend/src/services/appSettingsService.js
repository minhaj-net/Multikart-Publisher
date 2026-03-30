import pool from '../config/db.js';

const APP_SETTINGS_KEY = 'app_settings';

export async function get() {
  const [rows] = await pool.query(
    `SELECT value FROM settings WHERE \`key\` = ? AND deleted_at IS NULL LIMIT 1`,
    [APP_SETTINGS_KEY]
  );
  const row = rows[0];
  if (!row) return { values: {} };
  const values = typeof row.value === 'string' ? JSON.parse(row.value) : row.value;
  return { values: values || {} };
}

export async function set(body) {
  const values = body?.values != null ? body.values : body;
  const value = JSON.stringify(values && typeof values === 'object' ? values : {});
  await pool.query(
    `INSERT INTO settings (\`key\`, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = ?`,
    [APP_SETTINGS_KEY, value, value]
  );
  return get();
}
