import pool from '../config/db.js';

export async function getCounts(query = {}) {
  const filterBy = query.filter_by || 'today';
  let dateCond = '1=1';
  if (filterBy === 'today') dateCond = 'DATE(created_at) = CURDATE()';
  else if (filterBy === 'week') dateCond = 'created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)';
  else if (filterBy === 'month') dateCond = 'created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)';
  else if (filterBy === 'year') dateCond = 'created_at >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)';

  const [orderCount] = await pool.query(`SELECT COUNT(*) AS c FROM orders WHERE ${dateCond}`);
  const [userCount] = await pool.query(`SELECT COUNT(*) AS c FROM users WHERE ${dateCond} AND deleted_at IS NULL`);
  const [productCount] = await pool.query(`SELECT COUNT(*) AS c FROM products WHERE ${dateCond} AND deleted_at IS NULL`);

  const [totalOrders] = await pool.query('SELECT COUNT(*) AS c FROM orders');
  const [totalUsers] = await pool.query('SELECT COUNT(*) AS c FROM users WHERE deleted_at IS NULL');
  const [totalProducts] = await pool.query('SELECT COUNT(*) AS c FROM products WHERE deleted_at IS NULL');
  const [approvedProducts] = await pool.query('SELECT COUNT(*) AS c FROM products WHERE is_approved = 1 AND deleted_at IS NULL');
  const [totalStores] = await pool.query('SELECT COUNT(*) AS c FROM stores WHERE deleted_at IS NULL');
  const [approvedStores] = await pool.query('SELECT COUNT(*) AS c FROM stores WHERE deleted_at IS NULL');
  const [pendingRefunds] = await pool.query("SELECT COUNT(*) AS c FROM refunds WHERE status = 'pending' OR status IS NULL").catch(() => [{ c: 0 }]);
  let pendingWithdraw = [{ c: 0 }];
  try {
    [pendingWithdraw] = await pool.query(
      "SELECT COUNT(*) AS c FROM withdraw_requests WHERE (status = 'pending' OR status IS NULL) AND deleted_at IS NULL"
    );
  } catch (_) {}

  return {
    order: { total_orders: totalOrders[0]?.c ?? 0, count: orderCount[0]?.c ?? 0 },
    user: { total_users: totalUsers[0]?.c ?? 0, count: userCount[0]?.c ?? 0 },
    product: {
      total_products: totalProducts[0]?.c ?? 0,
      total_in_approved_products: approvedProducts[0]?.c ?? 0,
      count: productCount[0]?.c ?? 0,
    },
    store: {
      total_stores: totalStores[0]?.c ?? 0,
      total_in_approved_stores: approvedStores[0]?.c ?? 0,
    },
    refund: { total_pending_refunds: pendingRefunds[0]?.c ?? 0 },
    withdraw_request: { total_pending_withdraw_requests: pendingWithdraw[0]?.c ?? 0 },
  };
}

export async function getDashboardChart(query = {}) {
  const days = parseInt(query.days, 10) || 7;
  const [rows] = await pool.query(
    `SELECT DATE(created_at) AS date, COUNT(*) AS count FROM orders
     WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
     GROUP BY DATE(created_at) ORDER BY date`,
    [days]
  );
  const data = rows.map((r) => ({ date: r.date, count: r.count }));
  return { data };
}
