import express from 'express';
import * as authController from '../controllers/authController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/login/number', authController.loginByNumber);
router.get('/self', authMiddleware, authController.self);
router.post('/logout', authController.logout);
router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-otp', authController.verifyOtp);
router.post('/verify-token', authController.verifyOtp); // admin alias
router.post('/update-password', authController.updatePassword);
export default router;
