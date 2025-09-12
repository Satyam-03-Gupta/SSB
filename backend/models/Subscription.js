import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  item: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  message: { type: String },
  deliveryLocation: {
    latitude: { type: Number },
    longitude: { type: Number },
    address: { type: String, required: true }
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Subscription", subscriptionSchema);
