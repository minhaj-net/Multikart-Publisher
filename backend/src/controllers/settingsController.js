import * as settingsService from '../services/settingsService.js';

export async function get(req, res, next) {
  try {
    const data = await settingsService.get();
    res.json(data);
  } catch (e) {
    next(e);
  }
}
