import * as cartService from '../services/cartService.js';

export async function get(req, res, next) {
  try {
    const data = await cartService.get(req.user.id);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function add(req, res, next) {
  try {
    const data = await cartService.add(req.user.id, req.body);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function update(req, res, next) {
  try {
    const data = await cartService.update(req.user.id, req.params.id, req.body);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function remove(req, res, next) {
  try {
    await cartService.remove(req.user.id, req.params.id);
    res.json({ message: 'Removed' });
  } catch (e) {
    next(e);
  }
}

export async function replace(req, res, next) {
  try {
    const data = await cartService.replace(req.user.id, req.body);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function clear(req, res, next) {
  try {
    await cartService.clear(req.user.id);
    res.json({ message: 'ok' });
  } catch (e) {
    next(e);
  }
}

export async function sync(req, res, next) {
  try {
    const data = await cartService.sync(req.user.id, req.body);
    res.json(data);
  } catch (e) {
    next(e);
  }
}
