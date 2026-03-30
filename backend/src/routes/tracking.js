import express from 'express';
import * as trackingController from '../controllers/trackingController.js';

const router = express.Router();
router.get('/', trackingController.get);
export default router;
