import * as stateService from '../services/stateService.js';

export async function list(req, res, next) {
  try {
    const data = await stateService.list(req.query);
    res.json(data);
  } catch (e) {
    next(e);
  }
}
