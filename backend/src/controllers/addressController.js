import * as addressService from '../services/addressService.js';

export async function list(req, res, next) {
  try {
    const data = await addressService.list(req.user.id);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function create(req, res, next) {
  try {
    const data = await addressService.create(req.user.id, req.body);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function update(req, res, next) {
  try {
    const data = await addressService.update(req.user.id, req.params.id, req.body);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function remove(req, res, next) {
  try {
    await addressService.remove(req.user.id, req.params.id);
    res.json({ message: 'Removed' });
  } catch (e) {
    next(e);
  }
}
