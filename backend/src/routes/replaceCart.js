import express from 'express';
import * as cartController from '../controllers/cartController.js';

const router = express.Router();
router.post('/', cartController.replace);
export default router;
