import * as reviewService from '../services/reviewService.js';

export async function list(req, res, next) {
  try {
    const data = await reviewService.list(req.query);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function create(req, res, next) {
  try {
    const data = await reviewService.create(req.user.id, req.body);
    res.json(data);
  } catch (e) {
    next(e);
  }
}
