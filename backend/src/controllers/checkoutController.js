import * as orderService from '../services/orderService.js';

export async function get(req, res, next) {
  try {
    res.json({ message: 'ok' });
  } catch (e) {
    next(e);
  }
}

export async function create(req, res, next) {
  try {
    const data = await orderService.create(req.user.id, req.body);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function verifyPayment(req, res, next) {
  try {
    res.json({ message: 'Payment verified' });
  } catch (e) {
    next(e);
  }
}

export async function rePayment(req, res, next) {
  try {
    res.json({ message: 'ok' });
  } catch (e) {
    next(e);
  }
}
