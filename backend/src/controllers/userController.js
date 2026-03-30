import * as userService from '../services/userService.js';

export async function list(req, res, next) {
  try {
    const data = await userService.list(req.query);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function getById(req, res, next) {
  try {
    const user = await userService.getById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (e) {
    next(e);
  }
}

export async function create(req, res, next) {
  try {
    const user = await userService.create(req.body, req.user?.id);
    res.status(201).json(user);
  } catch (e) {
    next(e);
  }
}

export async function update(req, res, next) {
  try {
    const user = await userService.update(req.params.id, req.body);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (e) {
    next(e);
  }
}

export async function remove(req, res, next) {
  try {
    const ok = await userService.remove(req.params.id);
    if (!ok) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Deleted' });
  } catch (e) {
    next(e);
  }
}
