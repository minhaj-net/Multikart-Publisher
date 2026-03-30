import express from 'express';
import * as brandController from '../controllers/brandController.js';

const router = express.Router();
router.get('/', brandController.list);
router.get('/slug/:slug', brandController.getBySlug);
export default router;
