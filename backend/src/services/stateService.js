import pool from '../config/db.js';

export async function list(query = {}) {
  const countryId = query.country_id;
  let sql = 'SELECT id, name, country_id FROM states ORDER BY country_id, name';
  const params = [];
  if (countryId) {
    sql = 'SELECT id, name, country_id FROM states WHERE country_id = ? ORDER BY name';
    params.push(countryId);
  }
  const [rows] = await pool.query(sql, params);
  return rows;
}
