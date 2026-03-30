import pool from '../config/db.js';
import { paginateResponse } from '../utils/paginate.js';

export async function list(consumerId, query = {}) {
  if (!consumerId) return { current_page: 1, last_page: 0, total: 0, per_page: 25, data: [] };
  const page = parseInt(query.page, 10) || 1;
  const paginate = parseInt(query.paginate, 10) || 10;
  const [rows] = await pool.query(
    `SELECT o.* FROM orders o WHERE o.consumer_id = ? ORDER BY o.id DESC LIMIT ? OFFSET ?`,
    [consumerId, paginate, (page - 1) * paginate]
  );
  const [countResult] = await pool.query(
    'SELECT COUNT(*) AS total FROM orders WHERE consumer_id = ?',
    [consumerId]
  );
  const total = countResult[0]?.total ?? 0;
  const data = await Promise.all(rows.map((r) => enrichOrder(r)));
  return paginateResponse(data, page, paginate, total);
}

export async function getById(orderId, consumerId) {
  const [rows] = await pool.query(
    'SELECT * FROM orders WHERE id = ? AND consumer_id = ?',
    [orderId, consumerId]
  );
  const row = rows[0];
  if (!row) return null;
  return enrichOrder(row);
}

export async function create(consumerId, body) {
  const [ins] = await pool.query(
    `INSERT INTO orders (order_number, consumer_id, amount, total, payment_method, payment_status) VALUES (?, ?, ?, ?, ?, ?)`,
    [Date.now(), consumerId, body.amount || 0, body.total || 0, body.payment_method || 'cod', 'PENDING']
  );
  return getById(ins.insertId, consumerId);
}

export async function invoice(orderId, consumerId) {
  return getById(orderId, consumerId);
}

async function enrichOrder(row) {
  const [billing] = await pool.query(
    'SELECT a.* FROM addresses a WHERE a.id = ?',
    [row.billing_address_id]
  );
  const [shipping] = await pool.query(
    'SELECT a.* FROM addresses a WHERE a.id = ?',
    [row.shipping_address_id]
  );
  const [products] = await pool.query(
    'SELECT oi.* FROM order_items oi WHERE oi.order_id = ?',
    [row.id]
  );
  return {
    ...row,
    billing_address: billing[0] || null,
    shipping_address: shipping[0] || null,
    products,
  };
}
