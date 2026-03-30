import pool from '../config/db.js';

export async function get(req, res, next) {
  try {
    const { order_id } = req.query;
    if (!order_id) return res.status(400).json({ message: 'order_id required' });
    const [rows] = await pool.query(
      'SELECT * FROM orders WHERE id = ? AND consumer_id = ?',
      [order_id, req.user.id]
    );
    res.json(rows[0] || {});
  } catch (e) {
    next(e);
  }
}
