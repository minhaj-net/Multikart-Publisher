import * as storeService from '../services/storeService.js';

export async function list(req, res, next) {
  try {
    const data = await storeService.list(req.query);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function getBySlug(req, res, next) {
  try {
    const store = await storeService.getBySlug(req.params.slug);
    if (!store) return res.status(404).json({ message: 'Store not found' });
    res.json(store);
  } catch (e) {
    next(e);
  }
}

export async function updateStoreProfile(req, res, next) {
  try {
    const id = req.body?.id ?? req.params?.id;
    if (!id) return res.status(400).json({ message: 'Store id required' });
    const store = await storeService.updateProfile(id, req.body);
    if (!store) return res.status(404).json({ message: 'Store not found' });
    res.json(store);
  } catch (e) {
    next(e);
  }
}
