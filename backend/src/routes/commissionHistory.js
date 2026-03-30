import express from 'express';
import * as commissionHistoryController from '../controllers/commissionHistoryController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
router.get('/', authMiddleware, commissionHistoryController.list);
export default router;
