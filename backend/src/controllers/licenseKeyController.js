import * as licenseKeyService from '../services/licenseKeyService.js';

export async function list(req, res, next) {
  try {
    const data = await licenseKeyService.list(req.query);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function getById(req, res, next) {
  try {
    const item = await licenseKeyService.getById(req.params.id);
    if (!item) return res.status(404).json({ message: 'License key not found' });
    res.json(item);
  } catch (e) {
    next(e);
  }
}

export async function create(req, res, next) {
  try {
    const item = await licenseKeyService.create(req.body);
    res.status(201).json(item);
  } catch (e) {
    next(e);
  }
}

export async function update(req, res, next) {
  try {
    const item = await licenseKeyService.update(req.params.id, req.body);
    if (!item) return res.status(404).json({ message: 'License key not found' });
    res.json(item);
  } catch (e) {
    next(e);
  }
}

export async function remove(req, res, next) {
  try {
    const ok = await licenseKeyService.remove(req.params.id);
    if (!ok) return res.status(404).json({ message: 'License key not found' });
    res.json({ message: 'Deleted' });
  } catch (e) {
    next(e);
  }
}
