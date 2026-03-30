import * as shippingRuleService from '../services/shippingRuleService.js';

export async function list(req, res, next) {
  try {
    const data = await shippingRuleService.list(req.query);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function getById(req, res, next) {
  try {
    const rule = await shippingRuleService.getById(req.params.id);
    if (!rule) return res.status(404).json({ message: 'Shipping rule not found' });
    res.json(rule);
  } catch (e) {
    next(e);
  }
}

export async function create(req, res, next) {
  try {
    const rule = await shippingRuleService.create(req.body);
    res.status(201).json(rule);
  } catch (e) {
    next(e);
  }
}

export async function update(req, res, next) {
  try {
    const rule = await shippingRuleService.update(req.params.id, req.body);
    if (!rule) return res.status(404).json({ message: 'Shipping rule not found' });
    res.json(rule);
  } catch (e) {
    next(e);
  }
}

export async function remove(req, res, next) {
  try {
    const ok = await shippingRuleService.remove(req.params.id);
    if (!ok) return res.status(404).json({ message: 'Shipping rule not found' });
    res.json({ message: 'Deleted' });
  } catch (e) {
    next(e);
  }
}
