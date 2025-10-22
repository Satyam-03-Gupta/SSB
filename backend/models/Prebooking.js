import mongoose from "mongoose";

const prebookingSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  userEmail: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  deliveryAddress: { type: String, required: true },
  items: [{ 
    name: String, 
    price: Number, 
    quantity: Number 
  }],
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, default: 0 },
  gst: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  preferredDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Cancelled', 'Converted'], 
    default: 'Pending' 
  }
}, {
  timestamps: true
});

export default mongoose.model("Prebooking", prebookingSchema);