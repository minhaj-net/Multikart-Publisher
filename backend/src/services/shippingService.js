import pool from '../config/db.js';

export async function list() {
  const [zones] = await pool.query(
    `SELECT id, status, country_id, created_by_id, created_at, updated_at, deleted_at
     FROM shipping_zones WHERE deleted_at IS NULL ORDER BY id`
  );
  const zoneIds = zones.map((z) => z.id);
  const [rules] = zoneIds.length
    ? await pool.query(
        'SELECT * FROM shipping_rules WHERE deleted_at IS NULL AND shipping_zone_id IN (?)',
        [zoneIds]
      )
    : [];
  const [countries] = await pool.query(
    'SELECT id, name, currency, currency_symbol, iso_3166_2, iso_3166_3, calling_code, flag FROM countries'
  );
  const countryMap = {};
  for (const c of countries) countryMap[c.id] = c;
  const rulesByZone = {};
  for (const r of rules) {
    const zid = r.shipping_zone_id;
    if (!rulesByZone[zid]) rulesByZone[zid] = [];
    rulesByZone[zid].push(r);
  }
  return zones.map((z) => ({
    ...z,
    country: countryMap[z.country_id] || null,
    shipping_rules: rulesByZone[z.id] || [],
  }));
}

export async function getById(id) {
  const [rows] = await pool.query(
    'SELECT * FROM shipping_zones WHERE id = ? AND deleted_at IS NULL',
    [id]
  );
  if (!rows.length) return null;
  const z = rows[0];
  const [country] = await pool.query(
    'SELECT id, name, currency, currency_symbol, iso_3166_2, iso_3166_3, calling_code, flag FROM countries WHERE id = ?',
    [z.country_id]
  );
  const [rules] = await pool.query(
    'SELECT * FROM shipping_rules WHERE shipping_zone_id = ? AND deleted_at IS NULL',
    [id]
  );
  return { ...z, country: country[0] || null, shipping_rules: rules };
}

export async function create(body, createdById) {
  const { country_id, status } = body;
  const [r] = await pool.query(
    'INSERT INTO shipping_zones (country_id, status, created_by_id) VALUES (?, ?, ?)',
    [country_id || null, status !== undefined ? status : 1, createdById || null]
  );
  return getById(r.insertId);
}

export async function update(id, body) {
  const [ex] = await pool.query('SELECT id FROM shipping_zones WHERE id = ? AND deleted_at IS NULL', [id]);
  if (!ex.length) return null;
  const { country_id, status } = body;
  const updates = [];
  const params = [];
  if (country_id !== undefined) { updates.push('country_id = ?'); params.push(country_id); }
  if (status !== undefined) { updates.push('status = ?'); params.push(status); }
  if (updates.length) {
    params.push(id);
    await pool.query(`UPDATE shipping_zones SET ${updates.join(', ')} WHERE id = ?`, params);
  }
  return getById(id);
}

export async function remove(id) {
  const [r] = await pool.query('UPDATE shipping_zones SET deleted_at = NOW() WHERE id = ?', [id]);
  return r.affectedRows > 0;
}
