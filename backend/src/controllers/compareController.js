import * as compareService from '../services/compareService.js';

export async function list(req, res, next) {
  try {
    const data = await compareService.list(req.user.id);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function add(req, res, next) {
  try {
    const data = await compareService.add(req.user.id, req.body);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function remove(req, res, next) {
  try {
    await compareService.remove(req.user.id, req.params.id);
    res.json({ message: 'Removed' });
  } catch (e) {
    next(e);
  }
}
