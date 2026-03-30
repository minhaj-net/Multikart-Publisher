import * as downloadService from '../services/downloadService.js';

export async function list(req, res, next) {
  try {
    const data = await downloadService.list(req.user.id, req.query);
    res.json(data);
  } catch (e) {
    next(e);
  }
}
