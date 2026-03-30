import express from 'express';
import * as badgeController from '../controllers/badgeController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
router.get('/', authMiddleware, badgeController.list);
router.get('/:id', authMiddleware, badgeController.getById);
router.post('/', authMiddleware, badgeController.create);
router.put('/:id', authMiddleware, badgeController.update);
router.delete('/:id', authMiddleware, badgeController.remove);
export default router;
