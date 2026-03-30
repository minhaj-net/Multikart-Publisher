import express from 'express';
import * as themeOptionsController from '../controllers/themeOptionsController.js';

const router = express.Router();
router.get('/', themeOptionsController.get);
export default router;
