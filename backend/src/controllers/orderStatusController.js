import * as orderStatusService from '../services/orderStatusService.js';

export async function list(req, res, next) {
  try {
    const data = await orderStatusService.list();
    res.json(data);
  } catch (e) {
    next(e);
  }
}
