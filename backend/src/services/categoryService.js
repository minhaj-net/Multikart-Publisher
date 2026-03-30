import pool from '../config/db.js';

function buildTree(categories, parentId = null) {
  return categories
    .filter((c) => (c.parent_id == null && parentId === null) || (c.parent_id === parentId))
    .map((c) => ({
      ...c,
      subcategories: buildTree(categories, c.id),
    }));
}

export async function list() {
  const [rows] = await pool.query(
    `SELECT c.*, ci.asset_url AS category_image_asset, ci.original_url AS category_image_original,
      cicon.asset_url AS category_icon_asset, cicon.original_url AS category_icon_original
     FROM categories c
     LEFT JOIN media ci ON ci.id = c.category_image_id
     LEFT JOIN media cicon ON cicon.id = c.category_icon_id
     WHERE c.deleted_at IS NULL
     ORDER BY c.parent_id, c.id`
  );
  const withCounts = await Promise.all(
    rows.map(async (r) => {
      const [blogs] = await pool.query('SELECT COUNT(*) AS c FROM blog_categories WHERE category_id = ?', [r.id]);
      const [products] = await pool.query('SELECT COUNT(*) AS c FROM product_categories WHERE category_id = ?', [r.id]);
      return {
        ...r,
        blogs_count: blogs[0]?.c ?? 0,
        products_count: products[0]?.c ?? 0,
        category_image: r.category_image_asset
          ? { id: r.category_image_id, asset_url: r.category_image_asset, original_url: r.category_image_original }
          : null,
        category_icon: r.category_icon_asset
          ? { id: r.category_icon_id, asset_url: r.category_icon_asset, original_url: r.category_icon_original }
          : null,
        subcategories: [],
      };
    })
  );
  const tree = buildTree(withCounts.map((c) => ({ ...c, parent_id: c.parent_id })));
  return { current_page: 1, data: tree };
}
