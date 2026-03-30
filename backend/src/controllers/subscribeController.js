import pool from '../config/db.js';

export async function create(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'email required' });
    await pool.query('INSERT IGNORE INTO subscribers (email) VALUES (?)', [email]);
    res.json({ message: 'Subscribed' });
  } catch (e) {
    next(e);
  }
}
