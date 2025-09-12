import Subscription from "../models/Subscription.js";

export const createSubscription = async (req, res) => {
  try {
    console.log('Received order data:', req.body);
    const subscription = new Subscription(req.body);
    const savedSubscription = await subscription.save();
    console.log('Order saved successfully:', savedSubscription);
    res.status(201).json({ message: 'Order placed successfully', data: savedSubscription });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(400).json({ message: error.message, details: error });
  }
};

export const updateSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedSubscription = await Subscription.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedSubscription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    await Subscription.findByIdAndDelete(id);
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find();
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};