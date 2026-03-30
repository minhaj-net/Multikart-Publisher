import * as noticeService from '../services/noticeService.js';

export async function list(req, res, next) {
  try {
    const data = await noticeService.list(req.query);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function getById(req, res, next) {
  try {
    const notice = await noticeService.getById(req.params.id);
    if (!notice) return res.status(404).json({ message: 'Notice not found' });
    res.json(notice);
  } catch (e) {
    next(e);
  }
}

export async function create(req, res, next) {
  try {
    const notice = await noticeService.create(req.body, req.user?.id);
    res.status(201).json(notice);
  } catch (e) {
    next(e);
  }
}

export async function update(req, res, next) {
  try {
    const notice = await noticeService.update(req.params.id, req.body);
    if (!notice) return res.status(404).json({ message: 'Notice not found' });
    res.json(notice);
  } catch (e) {
    next(e);
  }
}

export async function remove(req, res, next) {
  try {
    const ok = await noticeService.remove(req.params.id);
    if (!ok) return res.status(404).json({ message: 'Notice not found' });
    res.json({ message: 'Deleted' });
  } catch (e) {
    next(e);
  }
}

export async function markAsRead(req, res, next) {
  try {
    const id = req.body?.id ?? req.params?.id;
    if (!id) return res.status(400).json({ message: 'Notice id required' });
    const data = await noticeService.markAsRead(id, req.user?.id);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function recent(req, res, next) {
  try {
    const limit = parseInt(req.query.limit, 10) || 5;
    const data = await noticeService.recent(limit);
    res.json(data);
  } catch (e) {
    next(e);
  }
}
