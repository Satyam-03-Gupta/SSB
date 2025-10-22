import express from 'express';
import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import QRCode from 'qrcode';

dotenv.config();

const router = express.Router();

// Check if Razorpay keys exist
let razorpay;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
  console.log('Razorpay initialized successfully');
} else {
  console.warn('⚠️ Razorpay keys missing. Payment routes will not work until keys are set.');
  // Mock object to prevent crashes
  razorpay = {
    orders: {
      create: async (options) => ({ id: 'fake_order_id', ...options })
    }
  };
}


// Create Razorpay order
router.post('/create-order', async (req, res) => {
  try {
    console.log('Razorpay Key ID:', process.env.RAZORPAY_KEY_ID);
    console.log('Request amount:', req.body.amount);
    
    const { amount } = req.body;
    
    const options = {
      amount: amount * 100, // Amount in paise
      currency: 'INR',
      receipt: `order_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('Razorpay Error Details:', error.error || error);
    res.status(500).json({ error: 'Failed to create order', details: error.message });
  }
});

// Generate QR code for COD payment
router.post('/generate-qr', async (req, res) => {
  try {
    const { amount, orderId } = req.body;
    
    // Create UPI payment URL
    const upiUrl = `upi://pay?pa=kingshuk616593.rzp@rxairtel&pn=SSB Biryani&am=${amount}&cu=INR&tn=Order Payment ${orderId}`;
    
    // Generate QR code
    const qrCode = await QRCode.toDataURL(upiUrl);
    
    res.json({ qrCode, upiUrl });
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

export default router;