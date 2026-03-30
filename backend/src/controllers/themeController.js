import * as themeService from '../services/themeService.js';

export async function list(req, res, next) {
  try {
    const data = await themeService.list();
    res.json(data);
  } catch (e) {
    next(e);
  }
}
