import * as attributeService from '../services/attributeService.js';

export async function list(req, res, next) {
  try {
    const data = await attributeService.list(req.query);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function getById(req, res, next) {
  try {
    const data = await attributeService.getById(req.params.id);
    if (!data) return res.status(404).json({ message: 'Not found' });
    res.json(data);
  } catch (e) {
    next(e);
  }
}
