import express from 'express';
import * as shippingRuleController from '../controllers/shippingRuleController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
router.get('/', authMiddleware, shippingRuleController.list);
router.get('/:id', authMiddleware, shippingRuleController.getById);
router.post('/', authMiddleware, shippingRuleController.create);
router.put('/:id', authMiddleware, shippingRuleController.update);
router.delete('/:id', authMiddleware, shippingRuleController.remove);
export default router;
