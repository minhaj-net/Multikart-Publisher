import * as taxService from '../services/taxService.js';

export async function list(req, res, next) {
  try {
    const data = await taxService.list(req.query);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function getById(req, res, next) {
  try {
    const tax = await taxService.getById(req.params.id);
    if (!tax) return res.status(404).json({ message: 'Tax not found' });
    res.json(tax);
  } catch (e) {
    next(e);
  }
}

export async function create(req, res, next) {
  try {
    const tax = await taxService.create(req.body, req.user?.id);
    res.status(201).json(tax);
  } catch (e) {
    next(e);
  }
}

export async function update(req, res, next) {
  try {
    const tax = await taxService.update(req.params.id, req.body);
    if (!tax) return res.status(404).json({ message: 'Tax not found' });
    res.json(tax);
  } catch (e) {
    next(e);
  }
}

export async function remove(req, res, next) {
  try {
    const ok = await taxService.remove(req.params.id);
    if (!ok) return res.status(404).json({ message: 'Tax not found' });
    res.json({ message: 'Deleted' });
  } catch (e) {
    next(e);
  }
}
