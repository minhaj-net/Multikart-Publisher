import express from 'express';
import * as adminWalletController from '../controllers/adminWalletController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
router.post('/wallet', authMiddleware, adminWalletController.creditWallet);
router.post('/vendorWallet', authMiddleware, adminWalletController.creditVendorWallet);
router.post('/points', authMiddleware, adminWalletController.creditPoints);
export default router;
