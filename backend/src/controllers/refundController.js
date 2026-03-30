import * as refundService from '../services/refundService.js';

export async function list(req, res, next) {
  try {
    const data = await refundService.list(req.user.id, req.query);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function create(req, res, next) {
  try {
    const data = await refundService.create(req.user.id, req.body);
    res.json(data);
  } catch (e) {
    next(e);
  }
}
