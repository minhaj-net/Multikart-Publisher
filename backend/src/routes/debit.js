import express from 'express';
import * as adminWalletController from '../controllers/adminWalletController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
router.post('/wallet', authMiddleware, adminWalletController.debitWallet);
router.post('/vendorWallet', authMiddleware, adminWalletController.debitVendorWallet);
router.post('/points', authMiddleware, adminWalletController.debitPoints);
export default router;
