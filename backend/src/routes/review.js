import express from 'express';
import * as reviewController from '../controllers/reviewController.js';

const router = express.Router();
router.get('/', reviewController.list);
router.post('/', reviewController.create);
export default router;
