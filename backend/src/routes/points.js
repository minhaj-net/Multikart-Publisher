import express from 'express';
import * as pointsController from '../controllers/pointsController.js';

const router = express.Router();
router.get('/', pointsController.get);
export default router;
