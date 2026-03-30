import express from 'express';
import * as taxController from '../controllers/taxController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
router.get('/', authMiddleware, taxController.list);
router.get('/:id', authMiddleware, taxController.getById);
router.post('/', authMiddleware, taxController.create);
router.put('/:id', authMiddleware, taxController.update);
router.delete('/:id', authMiddleware, taxController.remove);
export default router;
