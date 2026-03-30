import express from 'express';
import * as noticeController from '../controllers/noticeController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
router.get('/', authMiddleware, noticeController.list);
router.get('/recent', authMiddleware, noticeController.recent);
router.post('/markAsRead', authMiddleware, noticeController.markAsRead);
router.put('/markAsRead', authMiddleware, noticeController.markAsRead);
router.get('/:id', authMiddleware, noticeController.getById);
router.post('/', authMiddleware, noticeController.create);
router.put('/:id', authMiddleware, noticeController.update);
router.delete('/:id', authMiddleware, noticeController.remove);
export default router;
