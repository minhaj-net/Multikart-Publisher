import express from 'express';
import * as statisticsController from '../controllers/statisticsController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
router.get('/count', authMiddleware, statisticsController.getCount);
export default router;
