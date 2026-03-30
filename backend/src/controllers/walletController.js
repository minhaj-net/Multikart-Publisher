import * as walletService from '../services/walletService.js';

export async function get(req, res, next) {
  try {
    const data = await walletService.get(req.user.id, req.query);
    res.json(data);
  } catch (e) {
    next(e);
  }
}
