import * as commissionHistoryService from '../services/commissionHistoryService.js';

export async function list(req, res, next) {
  try {
    const data = await commissionHistoryService.list(req.query);
    res.json(data);
  } catch (e) {
    next(e);
  }
}
