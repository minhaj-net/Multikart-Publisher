import * as tagService from '../services/tagService.js';

export async function list(req, res, next) {
  try {
    const data = await tagService.list(req.query);
    res.json(data);
  } catch (e) {
    next(e);
  }
}
