import * as menuService from '../services/menuService.js';

export async function get(req, res, next) {
  try {
    const data = await menuService.get();
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function sort(req, res, next) {
  try {
    const data = await menuService.sort(req.body);
    res.json(data);
  } catch (e) {
    next(e);
  }
}
