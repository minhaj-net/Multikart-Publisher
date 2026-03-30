import * as themeOptionsService from '../services/themeOptionsService.js';

export async function get(req, res, next) {
  try {
    const data = await themeOptionsService.get();
    res.json(data);
  } catch (e) {
    next(e);
  }
}
