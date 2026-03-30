import pool from '../config/db.js';
import { paginateResponse } from '../utils/paginate.js';

export async function list(query = {}) {
  const page = parseInt(query.page, 10) || 1;
  const perPage = parseInt(query.paginate, 10) || 10;
  const [count] = await pool.query('SELECT COUNT(*) AS total FROM taxes WHERE deleted_at IS NULL');
  const total = count[0]?.total ?? 0;
  const [rows] = await pool.query(
    'SELECT id, name, rate, created_at, updated_at, deleted_at FROM taxes WHERE deleted_at IS NULL ORDER BY id LIMIT ? OFFSET ?',
    [perPage, (page - 1) * perPage]
  );
  const data = rows.map((r) => ({
    id: r.id,
    name: r.name,
    rate: String(Number(r.rate)),
    status: 1,
    created_by_id: null,
    created_at: r.created_at,
    updated_at: r.updated_at,
    deleted_at: r.deleted_at,
  }));
  return paginateResponse(data, page, perPage, total);
}

export async function getById(id) {
  const [rows] = await pool.query(
    'SELECT id, name, rate, created_at, updated_at, deleted_at FROM taxes WHERE id = ? AND deleted_at IS NULL',
    [id]
  );
  if (!rows.length) return null;
  const r = rows[0];
  return {
    id: r.id,
    name: r.name,
    rate: String(Number(r.rate)),
    status: 1,
    created_by_id: null,
    created_at: r.created_at,
    updated_at: r.updated_at,
    deleted_at: r.deleted_at,
  };
}

export async function create(body, createdById) {
  const { name, rate, status } = body;
  if (!name) throw Object.assign(new Error('Name required'), { statusCode: 400 });
  const [result] = await pool.query(
    'INSERT INTO taxes (name, rate) VALUES (?, ?)',
    [name, rate != null ? Number(rate) : 0]
  );
  return getById(result.insertId);
}

export async function update(id, body) {
  const [existing] = await pool.query('SELECT id FROM taxes WHERE id = ? AND deleted_at IS NULL', [id]);
  if (!existing.length) return null;
  const { name, rate, status } = body;
  const updates = [];
  const params = [];
  if (name !== undefined) { updates.push('name = ?'); params.push(name); }
  if (rate !== undefined) { updates.push('rate = ?'); params.push(Number(rate)); }
  if (updates.length) {
    params.push(id);
    await pool.query(`UPDATE taxes SET ${updates.join(', ')} WHERE id = ?`, params);
  }
  return getById(id);
}

export async function remove(id) {
  const [r] = await pool.query('UPDATE taxes SET deleted_at = NOW() WHERE id = ?', [id]);
  return r.affectedRows > 0;
}
