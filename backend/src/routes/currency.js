import express from 'express';
import * as currencyController from '../controllers/currencyController.js';

const router = express.Router();
router.get('/', currencyController.list);
export default router;
