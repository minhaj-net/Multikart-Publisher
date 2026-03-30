import express from 'express';
import * as withdrawRequestController from '../controllers/withdrawRequestController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
router.get('/', authMiddleware, withdrawRequestController.list);
router.get('/:id', authMiddleware, withdrawRequestController.getById);
router.post('/', authMiddleware, withdrawRequestController.create);
router.put('/:id', authMiddleware, withdrawRequestController.update);
export default router;
