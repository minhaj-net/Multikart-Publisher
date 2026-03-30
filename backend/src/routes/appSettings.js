import express from 'express';
import * as appSettingsController from '../controllers/appSettingsController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
router.get('/', authMiddleware, appSettingsController.get);
router.post('/', authMiddleware, appSettingsController.set);
router.put('/', authMiddleware, appSettingsController.set);
export default router;
