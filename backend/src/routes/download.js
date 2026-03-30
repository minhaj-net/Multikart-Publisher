import express from 'express';
import * as downloadController from '../controllers/downloadController.js';

const router = express.Router();
router.get('/', downloadController.list);
export default router;
