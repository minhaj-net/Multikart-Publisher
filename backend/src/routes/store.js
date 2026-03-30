import express from 'express';
import * as storeController from '../controllers/storeController.js';

const router = express.Router();
router.get('/', storeController.list);
router.get('/slug/:slug', storeController.getBySlug);
export default router;
