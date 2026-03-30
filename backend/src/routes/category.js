import express from 'express';
import * as categoryController from '../controllers/categoryController.js';
import * as csvStub from '../controllers/csvStubController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
router.get('/', categoryController.list);
router.post('/csv/import', authMiddleware, csvStub.importCsv);
router.get('/csv/export', authMiddleware, csvStub.exportCsv);
router.post('/csv/export', authMiddleware, csvStub.exportCsv);
export default router;
