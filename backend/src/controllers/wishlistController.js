import * as wishlistService from '../services/wishlistService.js';

export async function list(req, res, next) {
  try {
    const data = await wishlistService.list(req.user.id, req.query);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function add(req, res, next) {
  try {
    const data = await wishlistService.add(req.user.id, req.body);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function remove(req, res, next) {
  try {
    await wishlistService.remove(req.user.id, req.params.id);
    res.json({ message: 'Removed' });
  } catch (e) {
    next(e);
  }
}
