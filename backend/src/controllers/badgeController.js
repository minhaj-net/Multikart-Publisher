import * as badgeService from '../services/badgeService.js';

export async function list(req, res, next) {
  try {
    const data = await badgeService.list(req.query);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function getById(req, res, next) {
  try {
    const badge = await badgeService.getById(req.params.id);
    if (!badge) return res.status(404).json({ message: 'Badge not found' });
    res.json(badge);
  } catch (e) {
    next(e);
  }
}

export async function create(req, res, next) {
  try {
    const badge = await badgeService.create(req.body);
    res.status(201).json(badge);
  } catch (e) {
    next(e);
  }
}

export async function update(req, res, next) {
  try {
    const badge = await badgeService.update(req.params.id, req.body);
    if (!badge) return res.status(404).json({ message: 'Badge not found' });
    res.json(badge);
  } catch (e) {
    next(e);
  }
}

export async function remove(req, res, next) {
  try {
    const ok = await badgeService.remove(req.params.id);
    if (!ok) return res.status(404).json({ message: 'Badge not found' });
    res.json({ message: 'Deleted' });
  } catch (e) {
    next(e);
  }
}
