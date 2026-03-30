import express from 'express';
import * as attachmentController from '../controllers/attachmentController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
router.get('/', authMiddleware, attachmentController.list);
router.post('/', authMiddleware, attachmentController.create);
router.post('/deleteAll', authMiddleware, attachmentController.deleteAll);
export default router;
