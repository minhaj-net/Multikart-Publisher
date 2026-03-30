import pool from '../config/db.js';
import { paginateResponse } from '../utils/paginate.js';

export async function list(consumerId, query = {}) {
  const page = parseInt(query.page, 10) || 1;
  const paginate = parseInt(query.paginate, 10) || 10;
  const [rows] = await pool.query(
    'SELECT * FROM refunds WHERE consumer_id = ? ORDER BY id DESC LIMIT ? OFFSET ?',
    [consumerId, paginate, (page - 1) * paginate]
  );
  const [countResult] = await pool.query(
    'SELECT COUNT(*) AS total FROM refunds WHERE consumer_id = ?',
    [consumerId]
  );
  const total = countResult[0]?.total ?? 0;
  return paginateResponse(rows, page, paginate, total);
}

export async function create(consumerId, body) {
  const [ins] = await pool.query(
    'INSERT INTO refunds (consumer_id, order_id, reason, status) VALUES (?, ?, ?, ?)',
    [consumerId, body.order_id || null, body.reason || '', 'pending']
  );
  const [rows] = await pool.query('SELECT * FROM refunds WHERE id = ?', [ins.insertId]);
  return rows[0];
}
