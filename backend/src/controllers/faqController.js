import * as faqService from '../services/faqService.js';

export async function list(req, res, next) {
  try {
    const data = await faqService.list(req.query);
    res.json(data);
  } catch (e) {
    next(e);
  }
}
