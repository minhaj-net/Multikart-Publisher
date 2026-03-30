import express from 'express';
import * as licenseKeyController from '../controllers/licenseKeyController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
router.get('/', authMiddleware, licenseKeyController.list);
router.get('/:id', authMiddleware, licenseKeyController.getById);
router.post('/', authMiddleware, licenseKeyController.create);
router.put('/:id', authMiddleware, licenseKeyController.update);
router.delete('/:id', authMiddleware, licenseKeyController.remove);
export default router;
