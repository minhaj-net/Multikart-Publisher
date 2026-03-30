import bcrypt from 'bcryptjs';
import pool from '../config/db.js';

export async function updateProfile(userId, body) {
  const { name, email, phone, country_code } = body;
  await pool.query(
    'UPDATE users SET name = COALESCE(?, name), email = COALESCE(?, email), phone = COALESCE(?, phone), country_code = COALESCE(?, country_code), updated_at = NOW() WHERE id = ?',
    [name, email, phone, country_code, userId]
  );
  const [rows] = await pool.query('SELECT id, name, email, phone, country_code FROM users WHERE id = ?', [
    userId,
  ]);
  return rows[0];
}

export async function updatePassword(userId, body) {
  const { current_password, password } = body;
  if (!password) throw Object.assign(new Error('password required'), { statusCode: 400 });
  const [rows] = await pool.query('SELECT password_hash FROM users WHERE id = ?', [userId]);
  const user = rows[0];
  if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 });
  if (current_password) {
    const ok = await bcrypt.compare(current_password, user.password_hash);
    if (!ok) throw Object.assign(new Error('Current password is incorrect'), { statusCode: 400 });
  }
  const hash = await bcrypt.hash(password, 10);
  await pool.query('UPDATE users SET password_hash = ?, updated_at = NOW() WHERE id = ?', [
    hash,
    userId,
  ]);
}
