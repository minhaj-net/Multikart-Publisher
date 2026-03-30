import pool from '../config/db.js';

export async function get(consumerId, query = {}) {
  const [rows] = await pool.query(
    'SELECT * FROM point_transactions WHERE user_id = ? ORDER BY id DESC LIMIT 50',
    [consumerId]
  );
  const [total] = await pool.query(
    'SELECT COALESCE(SUM(points), 0) AS total FROM point_transactions WHERE user_id = ?',
    [consumerId]
  );
  return {
    total_points: total[0]?.total ?? 0,
    data: rows,
  };
}
