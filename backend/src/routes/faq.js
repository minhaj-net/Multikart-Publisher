import express from 'express';
import * as faqController from '../controllers/faqController.js';

const router = express.Router();
router.get('/', faqController.list);
export default router;
