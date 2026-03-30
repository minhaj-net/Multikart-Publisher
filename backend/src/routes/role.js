import express from 'express';
import * as roleController from '../controllers/roleController.js';

const router = express.Router();
router.get('/', roleController.list);
router.get('/:id', roleController.getById);
export default router;
