import express from 'express';
import * as paymentAccountController from '../controllers/paymentAccountController.js';

const router = express.Router();
router.get('/', paymentAccountController.list);
router.post('/', paymentAccountController.create);
export default router;
