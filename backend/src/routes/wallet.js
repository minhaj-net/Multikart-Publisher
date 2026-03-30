import express from 'express';
import * as walletController from '../controllers/walletController.js';

const router = express.Router();
router.get('/', walletController.get);
export default router;
