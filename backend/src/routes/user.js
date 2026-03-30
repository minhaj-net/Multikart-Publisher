import express from 'express';
import * as userController from '../controllers/userController.js';
import * as csvStub from '../controllers/csvStubController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
router.get('/', authMiddleware, userController.list);
router.post('/csv/import', authMiddleware, csvStub.importCsv);
router.get('/csv/export', authMiddleware, csvStub.exportCsv);
router.post('/csv/export', authMiddleware, csvStub.exportCsv);
router.get('/:id', authMiddleware, userController.getById);
router.post('/', authMiddleware, userController.create);
router.put('/:id', authMiddleware, userController.update);
router.delete('/:id', authMiddleware, userController.remove);
export default router;
