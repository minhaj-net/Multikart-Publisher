import pool from '../config/db.js';
import { paginateResponse } from '../utils/paginate.js';

export async function list(query = {}) {
  const page = parseInt(query.page, 10) || 1;
  const perPage = parseInt(query.paginate, 10) || 15;
  const search = query.search || '';
  const sort = query.sort || 'id_desc';
  let where = '1=1';
  const params = [];
  if (search) {
    where += ' AND (name LIKE ? OR file_name LIKE ?)';
    const term = `%${search}%`;
    params.push(term, term);
  }
  const [count] = await pool.query(
    `SELECT COUNT(*) AS total FROM media WHERE ${where}`,
    params
  );
  const total = count[0]?.total ?? 0;
  let order = 'ORDER BY id DESC';
  if (sort === 'id_asc') order = 'ORDER BY id ASC';
  else if (sort === 'name_asc') order = 'ORDER BY name ASC';
  else if (sort === 'name_desc') order = 'ORDER BY name DESC';
  const [rows] = await pool.query(
    `SELECT id, name, file_name, mime_type, disk, asset_url, original_url, created_by_id, created_at
     FROM media WHERE ${where} ${order} LIMIT ? OFFSET ?`,
    [...params, perPage, (page - 1) * perPage]
  );
  const data = rows.map((r) => ({
    id: r.id,
    name: r.name,
    file_name: r.file_name,
    mime_type: r.mime_type,
    disk: r.disk,
    asset_url: r.asset_url,
    original_url: r.original_url,
    created_by_id: r.created_by_id,
    created_at: r.created_at,
  }));
  return paginateResponse(data, page, perPage, total);
}

export async function create(body, file) {
  const name = body?.name || file?.originalname || 'file';
  const file_name = file?.originalname || name;
  const mime_type = file?.mimetype || body?.mime_type || null;
  const asset_url = body?.asset_url || file?.path || null;
  const original_url = asset_url;
  const [r] = await pool.query(
    `INSERT INTO media (name, file_name, mime_type, asset_url, original_url, created_by_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name, file_name, mime_type, asset_url, original_url, body?.created_by_id || null]
  );
  const [row] = await pool.query(
    'SELECT id, name, file_name, mime_type, disk, asset_url, original_url, created_at FROM media WHERE id = ?',
    [r.insertId]
  );
  return row[0];
}

export async function deleteAll(ids) {
  if (!ids || !Array.isArray(ids) || ids.length === 0) return { deleted: 0 };
  const placeholders = ids.map(() => '?').join(',');
  const [r] = await pool.query(`DELETE FROM media WHERE id IN (${placeholders})`, ids);
  return { deleted: r.affectedRows };
}
