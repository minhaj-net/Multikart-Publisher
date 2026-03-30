import express from 'express';
import * as checkoutController from '../controllers/checkoutController.js';

const router = express.Router();
router.get('/', checkoutController.get);
router.post('/', checkoutController.create);
router.post('/verifyPayment', checkoutController.verifyPayment);
router.post('/rePayment', checkoutController.rePayment);
export default router;
