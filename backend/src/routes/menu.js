import express from 'express';
import * as menuController from '../controllers/menuController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
router.get('/', menuController.get);
router.post('/sort', authMiddleware, menuController.sort);
export default router;
