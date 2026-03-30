import * as notificationService from '../services/notificationService.js';

export async function list(req, res, next) {
  try {
    const data = await notificationService.list(req.user.id, req.query);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function markAsRead(req, res, next) {
  try {
    await notificationService.markAsRead(req.user.id, req.body);
    res.json({ message: 'ok' });
  } catch (e) {
    next(e);
  }
}
