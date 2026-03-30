import express from 'express';
import * as shippingController from '../controllers/shippingController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
router.get('/', authMiddleware, shippingController.list);
router.get('/:id', authMiddleware, shippingController.getById);
router.post('/', authMiddleware, shippingController.create);
router.put('/:id', authMiddleware, shippingController.update);
router.delete('/:id', authMiddleware, shippingController.remove);
export default router;
