import express from 'express';
import * as productController from '../controllers/productController.js';
import * as csvStub from '../controllers/csvStubController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
router.get('/', productController.list);
router.put('/approve/:id', authMiddleware, productController.approve);
router.post('/approve/:id', authMiddleware, productController.approve);
router.post('/csv/import', authMiddleware, csvStub.importCsv);
router.get('/csv/export', authMiddleware, csvStub.exportCsv);
router.post('/csv/export', authMiddleware, csvStub.exportCsv);
router.get('/:productId', productController.getBySlugOrId);
export default router;
  