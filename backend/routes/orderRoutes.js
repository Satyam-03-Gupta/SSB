import express from 'express';
import { 
  createOrder, 
  getUserOrders, 
  getAllOrders, 
  updateOrderStatus, 
  cancelOrder,
  deleteOrder 
} from '../controllers/orderController.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/user/:email', getUserOrders);
router.get('/admin/all', getAllOrders);
router.put('/:id/status', updateOrderStatus);
router.put('/:id/cancel', cancelOrder);
router.delete('/:id', deleteOrder);

export default router;