import pool from '../config/db.js';
import { paginateResponse } from '../utils/paginate.js';

export async function list(query = {}) {
  const { category, tag, search, sortBy, page = 1, paginate = 10, status } = query;
  let sql = `
    SELECT b.* FROM blogs b
    WHERE b.deleted_at IS NULL
  `;
  const params = [];
  if (status != null) {
    sql += ' AND b.status = ?';
    params.push(status);
  }
  if (category) {
    const slugs = category.split(',').map((s) => s.trim());
    sql += ` AND EXISTS (SELECT 1 FROM blog_categories bc JOIN categories c ON c.id = bc.category_id WHERE bc.blog_id = b.id AND c.slug IN (${slugs.map(() => '?').join(',')}))`;
    params.push(...slugs);
  }
  if (tag) {
    const slugs = tag.split(',').map((s) => s.trim());
    sql += ` AND EXISTS (SELECT 1 FROM blog_tags bt JOIN tags t ON t.id = bt.tag_id WHERE bt.blog_id = b.id AND t.slug IN (${slugs.map(() => '?').join(',')}))`;
    params.push(...slugs);
  }
  if (search) {
    sql += ' AND b.title LIKE ?';
    params.push(`%${search}%`);
  }
  const orderBy =
    sortBy === 'desc'
      ? 'b.id DESC'
      : sortBy === 'a-z'
        ? 'b.title ASC'
        : sortBy === 'z-a'
          ? 'b.title DESC'
          : sortBy === 'newest'
            ? 'b.created_at DESC'
            : sortBy === 'oldest'
              ? 'b.created_at ASC'
              : 'b.id ASC';
  sql += ` ORDER BY ${orderBy}`;
  const [allRows] = await pool.query(sql, params);
  const total = allRows.length;
  const perPage = Math.max(1, parseInt(paginate, 10) || 10);
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const offset = (pageNum - 1) * perPage;
  const pageRows = allRows.slice(offset, offset + perPage);
  return paginateResponse(pageRows, pageNum, perPage, total);
}

export async function getBySlug(slug) {
  const [rows] = await pool.query(
    'SELECT * FROM blogs WHERE slug = ? AND deleted_at IS NULL',
    [slug]
  );
  return rows[0] || null;
}
