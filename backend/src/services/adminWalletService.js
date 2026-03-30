import pool from '../config/db.js';

export async function creditWallet(body) {
  const { consumer_id, amount, balance, type } = body;
  const value = amount != null ? amount : balance;
  if (!consumer_id || value == null) throw Object.assign(new Error('consumer_id and amount/balance required'), { statusCode: 400 });
  const amt = Number(value);
  if (amt <= 0) throw Object.assign(new Error('Amount must be positive'), { statusCode: 400 });
  await pool.query(
    'INSERT INTO wallet_transactions (user_id, amount, type) VALUES (?, ?, ?)',
    [consumer_id, amt, type || 'credit']
  );
  const [[row]] = await pool.query(
    'SELECT COALESCE(SUM(amount), 0) AS balance FROM wallet_transactions WHERE user_id = ?',
    [consumer_id]
  );
  return { message: 'Credited', balance: Number(row.balance) };
}

export async function debitWallet(body) {
  const { consumer_id, amount, balance, type } = body;
  const value = amount != null ? amount : balance;
  if (!consumer_id || value == null) throw Object.assign(new Error('consumer_id and amount/balance required'), { statusCode: 400 });
  const amt = Number(value);
  if (amt <= 0) throw Object.assign(new Error('Amount must be positive'), { statusCode: 400 });
  const [[row]] = await pool.query(
    'SELECT COALESCE(SUM(amount), 0) AS balance FROM wallet_transactions WHERE user_id = ?',
    [consumer_id]
  );
  const currentBalance = Number(row.balance);
  if (currentBalance < amt) throw Object.assign(new Error('Insufficient balance'), { statusCode: 400 });
  await pool.query(
    'INSERT INTO wallet_transactions (user_id, amount, type) VALUES (?, ?, ?)',
    [consumer_id, -amt, type || 'debit']
  );
  const [[row2]] = await pool.query(
    'SELECT COALESCE(SUM(amount), 0) AS balance FROM wallet_transactions WHERE user_id = ?',
    [consumer_id]
  );
  return { message: 'Debited', balance: Number(row2.balance) };
}

export async function vendorWalletList(query = {}) {
  const page = parseInt(query.page, 10) || 1;
  const perPage = parseInt(query.paginate, 10) || 10;
  const [rows] = await pool.query(
    `SELECT user_id, SUM(amount) AS balance FROM wallet_transactions GROUP BY user_id ORDER BY user_id LIMIT ? OFFSET ?`,
    [perPage, (page - 1) * perPage]
  );
  const [count] = await pool.query('SELECT COUNT(DISTINCT user_id) AS total FROM wallet_transactions');
  return {
    current_page: page,
    last_page: Math.ceil((count[0]?.total ?? 0) / perPage),
    total: count[0]?.total ?? 0,
    per_page: perPage,
    data: rows.map((r) => ({ user_id: r.user_id, balance: Number(r.balance) })),
  };
}

export async function creditVendorWallet(body) {
  return creditWallet({ ...body, type: 'vendor_credit' });
}

export async function debitVendorWallet(body) {
  return debitWallet({ ...body, type: 'vendor_debit' });
}
