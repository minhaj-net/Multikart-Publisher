import pool from '../config/db.js';

export async function list() {
  const [countries] = await pool.query(
    'SELECT id, name, currency, currency_symbol, iso_3166_2, iso_3166_3, calling_code, flag FROM countries ORDER BY name'
  );
  const [states] = await pool.query(
    'SELECT id, name, country_id FROM states ORDER BY country_id, name'
  );
  const statesByCountry = {};
  for (const s of states) {
    const cid = String(s.country_id);
    if (!statesByCountry[cid]) statesByCountry[cid] = [];
    statesByCountry[cid].push({ id: s.id, name: s.name, country_id: cid });
  }
  const result = countries.map((c) => ({
    ...c,
    state: statesByCountry[String(c.id)] || [],
  }));
  return result;
}
