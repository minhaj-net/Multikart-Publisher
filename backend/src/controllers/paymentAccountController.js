import * as paymentAccountService from '../services/paymentAccountService.js';

export async function list(req, res, next) {
  try {
    const data = await paymentAccountService.list(req.user.id);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function create(req, res, next) {
  try {
    const data = await paymentAccountService.create(req.user.id, req.body);
    res.json(data);
  } catch (e) {
    next(e);
  }
}
