import * as attachmentService from '../services/attachmentService.js';

export async function list(req, res, next) {
  try {
    const data = await attachmentService.list(req.query);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function create(req, res, next) {
  try {
    const file = req.file || (req.files && req.files[0]);
    const item = await attachmentService.create(req.body || {}, file);
    res.status(201).json(item);
  } catch (e) {
    next(e);
  }
}

export async function deleteAll(req, res, next) {
  try {
    const ids = req.body?.ids || req.body?.id ? [req.body.id] : [];
    const result = await attachmentService.deleteAll(ids);
    res.json({ message: 'Deleted', ...result });
  } catch (e) {
    next(e);
  }
}
