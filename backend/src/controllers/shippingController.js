import * as shippingService from '../services/shippingService.js';

export async function list(req, res, next) {
  try {
    const data = await shippingService.list();
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function getById(req, res, next) {
  try {
    const zone = await shippingService.getById(req.params.id);
    if (!zone) return res.status(404).json({ message: 'Shipping zone not found' });
    res.json(zone);
  } catch (e) {
    next(e);
  }
}

export async function create(req, res, next) {
  try {
    const zone = await shippingService.create(req.body, req.user?.id);
    res.status(201).json(zone);
  } catch (e) {
    next(e);
  }
}

export async function update(req, res, next) {
  try {
    const zone = await shippingService.update(req.params.id, req.body);
    if (!zone) return res.status(404).json({ message: 'Shipping zone not found' });
    res.json(zone);
  } catch (e) {
    next(e);
  }
}

export async function remove(req, res, next) {
  try {
    const ok = await shippingService.remove(req.params.id);
    if (!ok) return res.status(404).json({ message: 'Shipping zone not found' });
    res.json({ message: 'Deleted' });
  } catch (e) {
    next(e);
  }
}
