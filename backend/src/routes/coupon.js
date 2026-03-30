import express from 'express';
import * as couponController from '../controllers/couponController.js';

const router = express.Router();
router.get('/', couponController.list);
router.post('/validate', couponController.validate);
export default router;
