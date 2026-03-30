import * as appSettingsService from '../services/appSettingsService.js';

export async function get(req, res, next) {
  try {
    const data = await appSettingsService.get();
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function set(req, res, next) {
  try {
    const data = await appSettingsService.set(req.body);
    res.json(data);
  } catch (e) {
    next(e);
  }
}
