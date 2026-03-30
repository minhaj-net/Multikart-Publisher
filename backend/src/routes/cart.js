import express from 'express';
import * as cartController from '../controllers/cartController.js';

const router = express.Router();
router.get('/', cartController.get);
router.post('/', cartController.add);
router.put('/:id', cartController.update);
router.delete('/:id', cartController.remove);
router.post('/replace', (req, res) => res.json({ message: 'ok' }));
router.post('/clear', (req, res) => res.json({ message: 'ok' }));
router.post('/sync', (req, res) => res.json({ message: 'ok' }));
export default router;
