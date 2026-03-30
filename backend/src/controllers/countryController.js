import * as countryService from '../services/countryService.js';

export async function list(req, res, next) {
  try {
    const data = await countryService.list();
    res.json(data);
  } catch (e) {
    next(e);
  }
}
