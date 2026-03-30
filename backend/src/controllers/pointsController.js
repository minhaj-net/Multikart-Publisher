import * as pointsService from '../services/pointsService.js';

export async function get(req, res, next) {
  try {
    const data = await pointsService.get(req.user.id, req.query);
    res.json(data);
  } catch (e) {
    next(e);
  }
}
