import pool from '../config/db.js';
import * as productService from './productService.js';

export async function get(consumerId) {
  const [rows] = await pool.query(
    `SELECT ci.*, p.name AS product_name, p.slug AS product_slug, p.sale_price, p.product_thumbnail_id
     FROM cart_items ci
     JOIN products p ON p.id = ci.product_id
     WHERE ci.consumer_id = ? AND ci.deleted_at IS NULL`,
    [consumerId]
  );
  const items = await Promise.all(
    rows.map(async (r) => {
      const product = await productService.getBySlugOrId(r.product_id);
      return {
        id: r.id,
        product_id: r.product_id,
        variation_id: r.variation_id,
        consumer_id: r.consumer_id,
        quantity: r.quantity,
        sub_total: r.sub_total,
        wholesale_price: r.wholesale_price || 0,
        created_at: r.created_at,
        updated_at: r.updated_at,
        deleted_at: r.deleted_at,
        product: product || { id: r.product_id, name: r.product_name, slug: r.product_slug, sale_price: r.sale_price },
      };
    })
  );
  return { items };
}

export async function add(consumerId, body) {
  const { product_id, variation_id, quantity = 1 } = body;
  if (!product_id) throw Object.assign(new Error('product_id required'), { statusCode: 400 });
  const [prod] = await pool.query('SELECT id, sale_price FROM products WHERE id = ?', [product_id]);
  const product = prod[0];
  if (!product) throw Object.assign(new Error('Product not found'), { statusCode: 404 });
  const price = product.sale_price;
  const sub_total = price * (quantity || 1);
  const [ins] = await pool.query(
    `INSERT INTO cart_items (product_id, variation_id, consumer_id, quantity, sub_total) VALUES (?, ?, ?, ?, ?)`,
    [product_id, variation_id || null, consumerId, quantity || 1, sub_total]
  );
  return get(consumerId);
}

export async function update(consumerId, id, body) {
  const { quantity } = body;
  await pool.query(
    'UPDATE cart_items SET quantity = ?, sub_total = quantity * (SELECT sale_price FROM products WHERE id = cart_items.product_id) WHERE id = ? AND consumer_id = ?',
    [quantity, id, consumerId]
  );
  return get(consumerId);
}

export async function remove(consumerId, id) {
  await pool.query(
    'UPDATE cart_items SET deleted_at = NOW() WHERE id = ? AND consumer_id = ?',
    [id, consumerId]
  );
}

export async function replace(consumerId, body) {
  const items = body?.items;
  if (!Array.isArray(items)) return get(consumerId);
  await pool.query('UPDATE cart_items SET deleted_at = NOW() WHERE consumer_id = ?', [consumerId]);
  for (const it of items) {
    const { product_id, variation_id, quantity } = it;
    if (!product_id) continue;
    const [p] = await pool.query('SELECT sale_price FROM products WHERE id = ?', [product_id]);
    const price = p[0]?.sale_price ?? 0;
    await pool.query(
      'INSERT INTO cart_items (product_id, variation_id, consumer_id, quantity, sub_total) VALUES (?, ?, ?, ?, ?)',
      [product_id, variation_id || null, consumerId, quantity || 1, price * (quantity || 1)]
    );
  }
  return get(consumerId);
}

export async function clear(consumerId) {
  await pool.query('UPDATE cart_items SET deleted_at = NOW() WHERE consumer_id = ?', [consumerId]);
}

export async function sync(consumerId, body) {
  return replace(consumerId, body);
}
