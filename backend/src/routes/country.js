import express from 'express';
import * as countryController from '../controllers/countryController.js';

const router = express.Router();
router.get('/', countryController.list);
export default router;
