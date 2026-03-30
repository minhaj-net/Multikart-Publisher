import express from 'express';
import * as refundController from '../controllers/refundController.js';

const router = express.Router();
router.get('/', refundController.list);
router.post('/', refundController.create);
export default router;
