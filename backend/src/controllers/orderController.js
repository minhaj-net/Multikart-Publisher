import * as orderService from '../services/orderService.js';

export async function list(req, res, next) {
  try {
    const data = await orderService.list(req.user?.id, req.query);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function getById(req, res, next) {
  try {
    const order = await orderService.getById(req.params.orderId, req.user?.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
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

export async function invoice(req, res, next) {
  try {
    const orderId = req.params.orderId || req.query.orderId;
    const data = await orderService.invoice(orderId, req.user?.id);
    if (!data) return res.status(404).json({ message: 'Not found' });
    res.json(data);
  } catch (e) {
    next(e);
  }
}
