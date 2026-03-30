import express from 'express';
import * as adminWalletController from '../controllers/adminWalletController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
router.get('/', authMiddleware, adminWalletController.vendorWalletList);
export default router;
