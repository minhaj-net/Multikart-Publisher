import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import { paginateResponse } from '../utils/paginate.js';

export async function list(query = {}) {
  const page = parseInt(query.page, 10) || 1;
  const perPage = parseInt(query.paginate, 10) || 10;
  const search = query.search || '';
  const sortBy = query.sortBy || '';

  let where = 'u.deleted_at IS NULL';
  const params = [];
  if (search) {
    where += ' AND (u.name LIKE ? OR u.email LIKE ?)';
    const term = `%${search}%`;
    params.push(term, term);
  }

  const [all] = await pool.query(
    `SELECT u.id FROM users u LEFT JOIN roles r ON r.id = u.role_id WHERE ${where}`,
    params
  );
  const total = all.length;

  let order = 'ORDER BY u.id ASC';
  if (sortBy === 'desc') order = 'ORDER BY u.id DESC';
  else if (sortBy === 'newest') order = 'ORDER BY u.created_at DESC';
  else if (sortBy === 'oldest') order = 'ORDER BY u.created_at ASC';
  else if (sortBy === 'a-z') order = 'ORDER BY u.name ASC';
  else if (sortBy === 'z-a') order = 'ORDER BY u.name DESC';

  const [rows] = await pool.query(
    `SELECT u.id, u.name, u.email, u.country_code, u.phone, u.profile_image_id, u.system_reserve, u.status,
      u.created_by_id, u.email_verified_at, u.created_at, r.id AS role_id, r.name AS role_name, r.guard_name, r.system_reserve AS role_system_reserve
     FROM users u
     LEFT JOIN roles r ON r.id = u.role_id
     WHERE ${where} ${order} LIMIT ? OFFSET ?`,
    [...params, perPage, (page - 1) * perPage]
  );

  const userIds = rows.map((r) => r.id);
  const [ordersCount] = userIds.length
    ? await pool.query(
        `SELECT consumer_id, COUNT(*) AS c FROM orders WHERE consumer_id IN (?) GROUP BY consumer_id`,
        [userIds]
      )
    : [[]];
  const [walletSums] = userIds.length
    ? await pool.query(
        'SELECT user_id, COALESCE(SUM(amount), 0) AS balance FROM wallet_transactions WHERE user_id IN (?) GROUP BY user_id',
        [userIds]
      )
    : [[]];
  const [pointSums] = userIds.length
    ? await pool.query(
        'SELECT user_id, COALESCE(SUM(points), 0) AS balance FROM point_transactions WHERE user_id IN (?) GROUP BY user_id',
        [userIds]
      )
    : [[]];

  const ordersByUser = {};
  for (const o of ordersCount) ordersByUser[o.consumer_id] = o.c;
  const walletByUser = {};
  for (const w of walletSums) walletByUser[w.user_id] = Number(w.balance);
  const pointByUser = {};
  for (const p of pointSums) pointByUser[p.user_id] = Number(p.balance);

  const data = rows.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    country_code: u.country_code,
    phone: u.phone,
    profile_image_id: u.profile_image_id,
    system_reserve: String(u.system_reserve ?? '0'),
    status: u.status,
    created_by_id: u.created_by_id,
    email_verified_at: u.email_verified_at,
    created_at: u.created_at,
    orders_count: ordersByUser[u.id] ?? 0,
    role: u.role_id
      ? { id: u.role_id, name: u.role_name, guard_name: u.guard_name, system_reserve: String(u.role_system_reserve ?? '1') }
      : null,
    profile_image: null,
    wallet: { id: u.id, consumer_id: u.id, balance: walletByUser[u.id] ?? 0 },
    point: { id: u.id, consumer_id: u.id, balance: pointByUser[u.id] ?? 0 },
  }));

  return paginateResponse(data, page, perPage, total);
}

export async function getById(id) {
  const [rows] = await pool.query(
    `SELECT u.id, u.name, u.email, u.country_code, u.phone, u.profile_image_id, u.system_reserve, u.status,
      u.created_by_id, u.email_verified_at, u.created_at, r.id AS role_id, r.name AS role_name, r.guard_name, r.system_reserve AS role_system_reserve
     FROM users u LEFT JOIN roles r ON r.id = u.role_id WHERE u.id = ? AND u.deleted_at IS NULL`,
    [id]
  );
  if (!rows.length) return null;
  const u = rows[0];
  const [[{ c: ordersCount }]] = await pool.query('SELECT COUNT(*) AS c FROM orders WHERE consumer_id = ?', [id]);
  const [[{ balance: walletBalance }]] = await pool.query(
    'SELECT COALESCE(SUM(amount), 0) AS balance FROM wallet_transactions WHERE user_id = ?',
    [id]
  );
  const [[{ balance: pointBalance }]] = await pool.query(
    'SELECT COALESCE(SUM(points), 0) AS balance FROM point_transactions WHERE user_id = ?',
    [id]
  );
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    country_code: u.country_code,
    phone: u.phone,
    profile_image_id: u.profile_image_id,
    system_reserve: String(u.system_reserve ?? '0'),
    status: u.status,
    created_by_id: u.created_by_id,
    email_verified_at: u.email_verified_at,
    created_at: u.created_at,
    orders_count: ordersCount ?? 0,
    role: u.role_id
      ? { id: u.role_id, name: u.role_name, guard_name: u.guard_name, system_reserve: String(u.role_system_reserve ?? '1') }
      : null,
    profile_image: null,
    wallet: { id: u.id, consumer_id: u.id, balance: Number(walletBalance) },
    point: { id: u.id, consumer_id: u.id, balance: Number(pointBalance) },
  };
}

export async function create(body, createdById) {
  const { name, email, password, role_id, status, country_code, phone } = body;
  if (!email || !password) throw Object.assign(new Error('Email and password required'), { statusCode: 400 });
  const [existing] = await pool.query('SELECT id FROM users WHERE email = ? AND deleted_at IS NULL', [email]);
  if (existing.length) throw Object.assign(new Error('Email already registered'), { statusCode: 422 });
  const hash = await bcrypt.hash(password, 10);
  const [rows] = await pool.query(
    `INSERT INTO users (name, email, password_hash, role_id, status, country_code, phone, created_by_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [name || email.split('@')[0], email, hash, role_id || 2, status !== undefined ? status : 1, country_code || null, phone || null, createdById || null]
  );
  return getById(rows.insertId);
}

export async function update(id, body) {
  const [existing] = await pool.query('SELECT id FROM users WHERE id = ? AND deleted_at IS NULL', [id]);
  if (!existing.length) return null;
  const { name, email, role_id, status, country_code, phone, password } = body;
  const updates = [];
  const params = [];
  if (name !== undefined) { updates.push('name = ?'); params.push(name); }
  if (email !== undefined) { updates.push('email = ?'); params.push(email); }
  if (role_id !== undefined) { updates.push('role_id = ?'); params.push(role_id); }
  if (status !== undefined) { updates.push('status = ?'); params.push(status); }
  if (country_code !== undefined) { updates.push('country_code = ?'); params.push(country_code); }
  if (phone !== undefined) { updates.push('phone = ?'); params.push(phone); }
  if (password) {
    const hash = await bcrypt.hash(password, 10);
    updates.push('password_hash = ?');
    params.push(hash);
  }
  if (updates.length) {
    params.push(id);
    await pool.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, params);
  }
  return getById(id);
}

export async function remove(id) {
  const [r] = await pool.query('UPDATE users SET deleted_at = NOW() WHERE id = ?', [id]);
  return r.affectedRows > 0;
}
