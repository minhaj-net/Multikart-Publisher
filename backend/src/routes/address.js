import express from 'express';
import * as addressController from '../controllers/addressController.js';

const router = express.Router();
router.get('/', addressController.list);
router.post('/', addressController.create);
router.put('/:id', addressController.update);
router.delete('/:id', addressController.remove);
export default router;
