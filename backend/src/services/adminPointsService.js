import pool from '../config/db.js';

export async function creditPoints(body) {
  const { consumer_id, points, balance, type } = body;
  const value = points != null ? points : balance;
  if (!consumer_id || value == null) throw Object.assign(new Error('consumer_id and points/balance required'), { statusCode: 400 });
  const pts = Number(value);
  if (pts <= 0) throw Object.assign(new Error('Points must be positive'), { statusCode: 400 });
  await pool.query(
    'INSERT INTO point_transactions (user_id, points, type) VALUES (?, ?, ?)',
    [consumer_id, pts, type || 'credit']
  );
  const [[row]] = await pool.query(
    'SELECT COALESCE(SUM(points), 0) AS total FROM point_transactions WHERE user_id = ?',
    [consumer_id]
  );
  return { message: 'Credited', total_points: Number(row.total) };
}

export async function debitPoints(body) {
  const { consumer_id, points, balance, type } = body;
  const value = points != null ? points : balance;
  if (!consumer_id || value == null) throw Object.assign(new Error('consumer_id and points/balance required'), { statusCode: 400 });
  const pts = Number(value);
  if (pts <= 0) throw Object.assign(new Error('Points must be positive'), { statusCode: 400 });
  const [[row]] = await pool.query(
    'SELECT COALESCE(SUM(points), 0) AS total FROM point_transactions WHERE user_id = ?',
    [consumer_id]
  );
  const currentTotal = Number(row.total);
  if (currentTotal < pts) throw Object.assign(new Error('Insufficient points'), { statusCode: 400 });
  await pool.query(
    'INSERT INTO point_transactions (user_id, points, type) VALUES (?, ?, ?)',
    [consumer_id, -pts, type || 'debit']
  );
  const [[row2]] = await pool.query(
    'SELECT COALESCE(SUM(points), 0) AS total FROM point_transactions WHERE user_id = ?',
    [consumer_id]
  );
  return { message: 'Debited', total_points: Number(row2.total) };
}
