import * as currencyService from '../services/currencyService.js';

export async function list(req, res, next) {
  try {
    const data = await currencyService.list();
    res.json(data);
  } catch (e) {
    next(e);
  }
}
