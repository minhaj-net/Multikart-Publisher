import express from 'express';
import * as orderController from '../controllers/orderController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
router.get('/', orderController.list);
router.get('/invoice/:orderId?', orderController.invoice);
router.get('/:orderId', orderController.getById);
router.post('/', orderController.create);
export default router;
