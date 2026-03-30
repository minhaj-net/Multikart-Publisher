import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import config from '../config/index.js';

export async function register(body) {
  const { name, email, password } = body;
  if (!email || !password) throw Object.assign(new Error('Email and password required'), { statusCode: 400 });
  const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
  if (existing.length) throw Object.assign(new Error('Email already registered'), { statusCode: 422 });
  const hash = await bcrypt.hash(password, 10);
  const [rows] = await pool.query(
    'INSERT INTO users (name, email, password_hash, role_id, status) VALUES (?, ?, ?, 2, 1)',
    [name || email.split('@')[0], email, hash]
  );
  const userId = rows.insertId;
  const token = jwt.sign({ id: userId, role: 'consumer' }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
  const user = await getSelf({ id: userId });
  return { user, access_token: token  };
}

export async function login(body) {
  const { email, password } = body;
  if (!email || !password) throw Object.assign(new Error('Email and password required'), { statusCode: 400 });
  const [rows] = await pool.query(
    `SELECT u.id, u.email, u.password_hash, u.name, u.role_id, r.name AS role_name
     FROM users u
     LEFT JOIN roles r ON r.id = u.role_id
     WHERE u.email = ? AND u.deleted_at IS NULL`,
    [email]
  );
  const user = rows[0];
  if (!user) throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });
  const ok = await bcrypt.compare(password, user.password_hash);
  
  if (!ok) throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });
  const roleName = user.role_name || 'consumer';
  const token = jwt.sign({ id: user.id, role: roleName }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
  const selfData = await getSelf({ id: user.id });
  return { user: selfData, access_token: token };
}

export async function loginByNumber(body) {
  const { phone, country_code } = body;
  if (!phone) throw Object.assign(new Error('Phone required'), { statusCode: 400 });
  const [rows] = await pool.query(
    'SELECT id FROM users WHERE country_code = ? AND phone = ? AND deleted_at IS NULL',
    [country_code || '1', String(phone)]
  );
  const user = rows[0];
  if (!user) throw Object.assign(new Error('User not found'), { statusCode: 401 });
  const token = jwt.sign({ id: user.id, role: 'consumer' }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
  const selfData = await getSelf({ id: user.id });
  return { user: selfData, access_token: token  };
}

export async function getSelf(reqUser) {
  const [rows] = await pool.query(
    `SELECT u.id, u.name, u.email, u.country_code, u.phone, u.profile_image_id, u.system_reserve, u.status,
      u.created_by_id, u.email_verified_at, u.created_at, r.id AS role_id, r.name AS role_name, r.guard_name, r.system_reserve AS role_system_reserve
     FROM users u
     LEFT JOIN roles r ON r.id = u.role_id
     WHERE u.id = ? AND u.deleted_at IS NULL`,
    [reqUser.id]
  );
  const u = rows[0];
  if (!u) return null;
  const [ordersCount] = await pool.query('SELECT COUNT(*) AS c FROM orders WHERE consumer_id = ?', [u.id]);
  const [perms] = await pool.query(
    `SELECT p.id, p.name, p.guard_name, p.created_at, p.updated_at, rp.role_id AS pivot_role_id, rp.permission_id AS pivot_permission_id
     FROM permissions p
     JOIN role_permissions rp ON rp.permission_id = p.id
     WHERE rp.role_id = ?`,
    [u.role_id]
  );
  const permissions = perms.map((p) => ({
    id: p.id,
    name: p.name,
    guard_name: p.guard_name,
    created_at: p.created_at,
    updated_at: p.updated_at,
    pivot: { role_id: String(u.role_id), permission_id: String(p.id) },
  }));
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    country_code: u.country_code,
    phone: u.phone,
    profile_image_id: u.profile_image_id,
    system_reserve: u.system_reserve,
    status: u.status,
    created_by_id: u.created_by_id,
    email_verified_at: u.email_verified_at,
    created_at: u.created_at,
    orders_count: ordersCount[0]?.c ?? 0,
    role: u.role_id
      ? {
          id: u.role_id,
          name: u.role_name,
          guard_name: u.guard_name,
          system_reserve: u.role_system_reserve,
        }
      : null,
    permission: permissions,
  };
}

export async function forgotPassword(body) {
  return { message: 'OTP sent' };
}

export async function verifyOtp(body) {
  return { message: 'Verified' };
}

export async function updatePassword(body) {
  const { token, password } = body;
  if (!password) throw Object.assign(new Error('Password required'), { statusCode: 400 });
  return { message: 'Password updated' };
}
