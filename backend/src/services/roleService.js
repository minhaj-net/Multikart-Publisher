import pool from '../config/db.js';

export async function list() {
  const [roles] = await pool.query(
    'SELECT id, name, guard_name, system_reserve FROM roles ORDER BY id'
  );
  const [perms] = await pool.query(
    'SELECT id, name, guard_name, created_at, updated_at FROM permissions ORDER BY name'
  );
  const [pivot] = await pool.query('SELECT role_id, permission_id FROM role_permissions');
  const byRole = {};
  for (const p of pivot) {
    const r = String(p.role_id);
    if (!byRole[r]) byRole[r] = [];
    const perm = perms.find((x) => x.id === p.permission_id);
    if (perm) byRole[r].push({ ...perm, pivot: { role_id: String(p.role_id), permission_id: String(p.permission_id) } });
  }
  const data = roles.map((r) => ({
    ...r,
    system_reserve: String(r.system_reserve ?? '0'),
    created_at: r.created_at,
    updated_at: r.updated_at,
    permissions: byRole[String(r.id)] || [],
  }));
  return { data };
}

export async function getById(id) {
  const [rows] = await pool.query(
    'SELECT id, name, guard_name, system_reserve FROM roles WHERE id = ?',
    [id]
  );
  if (!rows.length) return null;
  const role = rows[0];
  const [perms] = await pool.query(
    `SELECT p.id, p.name, p.guard_name, p.created_at, p.updated_at, rp.role_id, rp.permission_id
     FROM role_permissions rp
     JOIN permissions p ON p.id = rp.permission_id
     WHERE rp.role_id = ?`,
    [id]
  );
  role.permissions = perms.map((p) => ({
    id: p.id,
    name: p.name,
    guard_name: p.guard_name,
    created_at: p.created_at,
    updated_at: p.updated_at,
    pivot: { role_id: String(p.role_id), permission_id: String(p.permission_id) },
  }));
  return role;
}
