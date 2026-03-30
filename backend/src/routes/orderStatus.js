import express from 'express';
import * as orderStatusController from '../controllers/orderStatusController.js';

const router = express.Router();
router.get('/', orderStatusController.list);
export default router;
