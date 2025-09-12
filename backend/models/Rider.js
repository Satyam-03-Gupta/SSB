import mongoose from "mongoose";

const RiderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  vehicleNumber: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  role: { type: String, default: "rider" }
}, { timestamps: true });

export default mongoose.model("Rider", RiderSchema);