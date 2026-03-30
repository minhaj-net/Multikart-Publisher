import pool from '../config/db.js';

/** Returns section config in the shape expected by frontend: { id, content } */
export async function getSection(section) {
  if (!section) return { id: null, content: {} };
  const [rows] = await pool.query(
    "SELECT value FROM settings WHERE `key` = ? AND deleted_at IS NULL LIMIT 1",
    [`home_${section}`]
  );
  const row = rows[0];
  if (!row || !row.value) {
    return { id: null, content: {} };
  }
  const data = typeof row.value === 'string' ? JSON.parse(row.value) : row.value;
  if (!data || typeof data !== 'object') return { id: null, content: {} };
  return { id: data.id ?? null, content: data.content ?? {} };
}
