import * as pageService from '../services/pageService.js';

export async function list(req, res, next) {
  try {
    const data = await pageService.list(req.query);
    res.json(data);
  } catch (e) {
    next(e);
  }
}
