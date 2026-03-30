import pool from '../config/db.js';
import { paginateResponse } from '../utils/paginate.js';

export async function get(consumerId, query = {}) {
  const page = parseInt(query.page, 10) || 1;
  const paginate = parseInt(query.paginate, 10) || 10;
  const [rows] = await pool.query(
    `SELECT * FROM wallet_transactions WHERE user_id = ? ORDER BY id DESC LIMIT ? OFFSET ?`,
    [consumerId, paginate, (page - 1) * paginate]
  );
  const [balance] = await pool.query(
    'SELECT COALESCE(SUM(amount), 0) AS balance FROM wallet_transactions WHERE user_id = ?',
    [consumerId]
  );
  return {
    balance: balance[0]?.balance ?? 0,
    current_page: page,
    last_page: Math.ceil((rows.length || 1) / paginate),
    total: rows.length,
    per_page: paginate,
    data: rows,
  };
}
