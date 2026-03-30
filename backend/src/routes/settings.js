import express from 'express';
import * as settingsController from '../controllers/settingsController.js';

const router = express.Router();
router.get('/', settingsController.get);
export default router;
