import pool from '../config/db.js';

export async function list(query = {}) {
  const zoneId = query.shipping_zone_id || query.shipping_id;
  let sql = 'SELECT * FROM shipping_rules WHERE deleted_at IS NULL ORDER BY id';
  const params = [];
  if (zoneId) {
    sql = 'SELECT * FROM shipping_rules WHERE shipping_zone_id = ? AND deleted_at IS NULL ORDER BY id';
    params.push(zoneId);
  }
  const [rows] = await pool.query(sql, params);
  return rows;
}

export async function getById(id) {
  const [rows] = await pool.query(
    'SELECT * FROM shipping_rules WHERE id = ? AND deleted_at IS NULL',
    [id]
  );
  return rows[0] || null;
}

export async function create(body) {
  const { shipping_zone_id, name, min_order, max_order, rate, status } = body;
  if (!shipping_zone_id) throw Object.assign(new Error('shipping_zone_id required'), { statusCode: 400 });
  const [r] = await pool.query(
    `INSERT INTO shipping_rules (shipping_zone_id, name, min_order, max_order, rate, status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      shipping_zone_id,
      name || null,
      min_order != null ? Number(min_order) : 0,
      max_order != null ? Number(max_order) : null,
      rate != null ? Number(rate) : 0,
      status !== undefined ? status : 1,
    ]
  );
  return getById(r.insertId);
}

export async function update(id, body) {
  const [ex] = await pool.query('SELECT id FROM shipping_rules WHERE id = ? AND deleted_at IS NULL', [id]);
  if (!ex.length) return null;
  const { name, min_order, max_order, rate, status } = body;
  const updates = [];
  const params = [];
  if (name !== undefined) { updates.push('name = ?'); params.push(name); }
  if (min_order !== undefined) { updates.push('min_order = ?'); params.push(Number(min_order)); }
  if (max_order !== undefined) { updates.push('max_order = ?'); params.push(max_order == null ? null : Number(max_order)); }
  if (rate !== undefined) { updates.push('rate = ?'); params.push(Number(rate)); }
  if (status !== undefined) { updates.push('status = ?'); params.push(status); }
  if (updates.length) {
    params.push(id);
    await pool.query(`UPDATE shipping_rules SET ${updates.join(', ')} WHERE id = ?`, params);
  }
  return getById(id);
}

export async function remove(id) {
  const [r] = await pool.query('UPDATE shipping_rules SET deleted_at = NOW() WHERE id = ?', [id]);
  return r.affectedRows > 0;
}
