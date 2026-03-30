import * as productService from '../services/productService.js';

export async function list(req, res, next) {
  try {
    const data = await productService.list(req.query);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function getBySlugOrId(req, res, next) {
  try {
    const product = await productService.getBySlugOrId(req.params.productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (e) {
    next(e);
  }
}

export async function approve(req, res, next) {
  try {
    const product = await productService.approve(req.params.id, req.body);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (e) {
    next(e);
  }
}
