import express from 'express';
import { getStoreStatus, updateStoreStatus } from '../controllers/storeController.js';

const router = express.Router();

router.get('/status', getStoreStatus);
router.put('/status', updateStoreStatus);

export default router;