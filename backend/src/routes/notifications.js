import express from 'express';
import * as notificationController from '../controllers/notificationController.js';

const router = express.Router();
router.get('/', notificationController.list);
router.post('/markAsRead', notificationController.markAsRead);
export default router;
