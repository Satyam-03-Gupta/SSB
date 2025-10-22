import express from 'express';
import { createPrebooking, getUserPrebookings, getAllPrebookings, updatePrebookingStatus } from '../controllers/prebookingController.js';

const router = express.Router();

router.post('/', createPrebooking);
router.get('/user/:email', getUserPrebookings);
router.get('/all', getAllPrebookings);
router.put('/:id/status', updatePrebookingStatus);

export default router;