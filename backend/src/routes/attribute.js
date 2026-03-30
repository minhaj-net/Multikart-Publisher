import express from 'express';
import * as attributeController from '../controllers/attributeController.js';
import * as csvStub from '../controllers/csvStubController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
router.get('/', attributeController.list);
router.post('/csv/import', authMiddleware, csvStub.importCsv);
router.get('/csv/export', authMiddleware, csvStub.exportCsv);
router.post('/csv/export', authMiddleware, csvStub.exportCsv);
router.get('/:id', attributeController.getById);
export default router;
