import express from 'express';
import * as pageController from '../controllers/pageController.js';

const router = express.Router();
router.get('/', pageController.list);
export default router;
