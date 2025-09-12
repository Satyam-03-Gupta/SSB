import Rider from "../models/Rider.js";
import Order from "../models/Order.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const riderLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const rider = await Rider.findOne({ email });
    if (!rider) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, rider.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ riderId: rider._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ 
      message: "Login successful", 
      token, 
      rider: { 
        id: rider._id, 
        name: rider.name, 
        email: rider.email 
      } 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRiderOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSingleOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      orderId, 
      { status, riderId: req.riderId }, 
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};