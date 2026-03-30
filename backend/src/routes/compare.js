import express from 'express';
import * as compareController from '../controllers/compareController.js';

const router = express.Router();
router.get('/', compareController.list);
router.post('/', compareController.add);
router.delete('/:id', compareController.remove);
export default router;
