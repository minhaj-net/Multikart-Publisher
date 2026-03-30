import pool from '../config/db.js';

export async function list(userId) {
  const [rows] = await pool.query(
    'SELECT c.* FROM compare_items c WHERE c.user_id = ? AND c.deleted_at IS NULL',
    [userId]
  );
  return { data: rows };
}

export async function add(userId, body) {
  const { product_id } = body;
  if (!product_id) throw Object.assign(new Error('product_id required'), { statusCode: 400 });
  await pool.query('INSERT IGNORE INTO compare_items (user_id, product_id) VALUES (?, ?)', [
    userId,
    product_id,
  ]);
  return list(userId);
}

export async function remove(userId, id) {
  await pool.query(
    'UPDATE compare_items SET deleted_at = NOW() WHERE id = ? AND user_id = ?',
    [id, userId]
  );
}
