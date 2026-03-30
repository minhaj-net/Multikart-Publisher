import express from 'express';
import * as questionAnswerController from '../controllers/questionAnswerController.js';

const router = express.Router();
router.get('/', questionAnswerController.list);
router.post('/', questionAnswerController.create);
router.post('/feedback', questionAnswerController.feedback);
export default router;
