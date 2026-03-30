import * as couponService from '../services/couponService.js';

export async function list(req, res, next) {
  try {
    const data = await couponService.list(req.query);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function validate(req, res, next) {
  try {
    const data = await couponService.validate(req.body);
    res.json(data);
  } catch (e) {
    next(e);
  }
}
