import express from 'express';
import * as subscribeController from '../controllers/subscribeController.js';

const router = express.Router();
router.post('/', subscribeController.create);
export default router;
