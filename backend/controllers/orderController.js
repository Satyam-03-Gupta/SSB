import Order from '../models/Order.js';

// Create new order
export const createOrder = async (req, res) => {
  try {
    const { orderId, userEmail, phoneNumber, deliveryAddress, items, subtotal, deliveryFee, gst, totalAmount } = req.body;
    
    const order = new Order({
      orderId,
      userEmail,
      phoneNumber,
      deliveryAddress,
      items,
      subtotal,
      deliveryFee,
      gst,
      totalAmount
    });

    await order.save();
    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
};

// Get orders by user email
export const getUserOrders = async (req, res) => {
  try {
    const { email } = req.params;
    const orders = await Order.find({ userEmail: email }).sort({ orderDate: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

// Get all orders (admin) - exclude deleted ones
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({ deletedFromAdmin: false }).sort({ orderDate: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order', error: error.message });
  }
};

// Cancel order (user can cancel within 5 minutes if status is Pending or Confirmed)
export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    
    const order = await Order.findById(id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if order can be cancelled
    const currentTime = new Date();
    const orderTime = new Date(order.orderDate);
    const timeDiff = (currentTime - orderTime) / (1000 * 60); // difference in minutes
    
    if (timeDiff > 5) {
      return res.status(400).json({ message: 'Order cannot be cancelled after 5 minutes' });
    }
    
    if (!['Pending', 'Confirmed'].includes(order.status)) {
      return res.status(400).json({ message: 'Order cannot be cancelled at this stage' });
    }
    
    const updatedOrder = await Order.findByIdAndUpdate(
      id, 
      { status: 'Cancelled' }, 
      { new: true }
    );
    
    res.json({ message: 'Order cancelled successfully', order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling order', error: error.message });
  }
};

// Soft delete order (hide from admin, keep for user)
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    
    const order = await Order.findByIdAndUpdate(
      id, 
      { deletedFromAdmin: true }, 
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json({ message: 'Order removed from admin view' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing order', error: error.message });
  }
};