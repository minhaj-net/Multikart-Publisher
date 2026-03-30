import pool from '../config/db.js';

export async function list(userId) {
  const [rows] = await pool.query(
    `SELECT a.*, c.name AS country_name, s.name AS state_name
     FROM addresses a
     LEFT JOIN countries c ON c.id = a.country_id
     LEFT JOIN states s ON s.id = a.state_id
     WHERE a.user_id = ? AND a.deleted_at IS NULL`,
    [userId]
  );
  return rows.map((r) => ({
    ...r,
    country: r.country_id ? { id: r.country_id, name: r.country_name } : null,
    state: r.state_id ? { id: r.state_id, name: r.state_name, country_id: r.country_id } : null,
  }));
}

export async function create(userId, body) {
  const [ins] = await pool.query(
    `INSERT INTO addresses (user_id, title, street, city, pincode, state_id, country_id, phone, country_code, is_default)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      body.title || '',
      body.street || '',
      body.city || '',
      body.pincode || '',
      body.state_id || null,
      body.country_id || null,
      body.phone || null,
      body.country_code || null,
      body.is_default ? 1 : 0,
    ]
  );
  const [rows] = await pool.query('SELECT * FROM addresses WHERE id = ?', [ins.insertId]);
  return rows[0];
}

export async function update(userId, id, body) {
  await pool.query(
    `UPDATE addresses SET title=?, street=?, city=?, pincode=?, state_id=?, country_id=?, phone=?, country_code=?, is_default=? WHERE id=? AND user_id=?`,
    [
      body.title,
      body.street,
      body.city,
      body.pincode,
      body.state_id,
      body.country_id,
      body.phone,
      body.country_code,
      body.is_default ? 1 : 0,
      id,
      userId,
    ]
  );
  const [rows] = await pool.query('SELECT * FROM addresses WHERE id = ?', [id]);
  return rows[0];
}

export async function remove(userId, id) {
  await pool.query('UPDATE addresses SET deleted_at = NOW() WHERE id = ? AND user_id = ?', [id, userId]);
}
