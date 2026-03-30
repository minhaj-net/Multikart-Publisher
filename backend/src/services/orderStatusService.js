import pool from '../config/db.js';

export async function list() {
  const [rows] = await pool.query('SELECT * FROM order_statuses ORDER BY id');
  return { data: rows };
}
