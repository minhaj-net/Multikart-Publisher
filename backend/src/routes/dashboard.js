import express from 'express';
import * as statisticsController from '../controllers/statisticsController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
router.get('/chart', authMiddleware, statisticsController.getChart);
export default router;
