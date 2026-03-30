import express from 'express';
import * as storeController from '../controllers/storeController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
router.put('/', authMiddleware, storeController.updateStoreProfile);
router.post('/', authMiddleware, storeController.updateStoreProfile);
export default router;
