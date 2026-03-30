import * as withdrawRequestService from '../services/withdrawRequestService.js';

export async function list(req, res, next) {
  try {
    const data = await withdrawRequestService.list(req.query);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function getById(req, res, next) {
  try {
    const item = await withdrawRequestService.getById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Withdraw request not found' });
    res.json(item);
  } catch (e) {
    next(e);
  }
}

export async function create(req, res, next) {
  try {
    const item = await withdrawRequestService.create(req.body);
    res.status(201).json(item);
  } catch (e) {
    next(e);
  }
}

export async function update(req, res, next) {
  try {
    const item = await withdrawRequestService.update(req.params.id, req.body);
    if (!item) return res.status(404).json({ message: 'Withdraw request not found' });
    res.json(item);
  } catch (e) {
    next(e);
  }
}
