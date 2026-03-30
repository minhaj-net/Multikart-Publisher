import express from 'express';
import * as wishlistController from '../controllers/wishlistController.js';

const router = express.Router();
router.get('/', wishlistController.list);
router.post('/', wishlistController.add);
router.delete('/:id', wishlistController.remove);
export default router;
