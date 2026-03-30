import express from 'express';
import * as themeController from '../controllers/themeController.js';

const router = express.Router();
router.get('/', themeController.list);
export default router;
