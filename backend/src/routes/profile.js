import express from 'express';
import * as profileController from '../controllers/profileController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
router.post('/updateProfile', authMiddleware, profileController.updateProfile);
router.post('/updatePassword', authMiddleware, profileController.updatePassword);
export default router;
