import * as categoryService from '../services/categoryService.js';

export async function list(req, res, next) {
  try {
    const data = await categoryService.list();
    res.json(data);
  } catch (e) {
    next(e);
  }
}
