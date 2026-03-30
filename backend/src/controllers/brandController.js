import * as brandService from '../services/brandService.js';

export async function list(req, res, next) {
  try {
    const data = await brandService.list(req.query);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function getBySlug(req, res, next) {
  try {
    const brand = await brandService.getBySlug(req.params.slug);
    if (!brand) return res.status(404).json({ message: 'Brand not found' });
    res.json(brand);
  } catch (e) {
    next(e);
  }
}
