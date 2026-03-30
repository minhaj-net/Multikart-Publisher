import express from 'express';
import * as blogController from '../controllers/blogController.js';

const router = express.Router();
router.get('/', blogController.list);
router.get('/slug/:slug', blogController.getBySlug);
export default router;
