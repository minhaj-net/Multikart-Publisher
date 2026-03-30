import express from 'express';
import * as stateController from '../controllers/stateController.js';

const router = express.Router();
router.get('/', stateController.list);
export default router;
