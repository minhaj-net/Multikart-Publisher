import pool from '../config/db.js';

export async function list(userId) {
  const [rows] = await pool.query(
    'SELECT * FROM payment_accounts WHERE user_id = ? AND deleted_at IS NULL',
    [userId]
  );
  return { data: rows };
}

export async function create(userId, body) {
  const [ins] = await pool.query(
    'INSERT INTO payment_accounts (user_id, type, details) VALUES (?, ?, ?)',
    [userId, body.type || 'bank', JSON.stringify(body.details || {})]
  );
  const [rows] = await pool.query('SELECT * FROM payment_accounts WHERE id = ?', [ins.insertId]);
  return rows[0];
}
