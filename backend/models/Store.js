import mongoose from "mongoose";

const storeSchema = new mongoose.Schema({
  isOpen: { type: Boolean, default: true },
  closureReason: { type: String, default: "" },
  reopenTime: { type: Date },
  allowPrebooking: { type: Boolean, default: true },
  message: { type: String, default: "Store is temporarily closed. Please come back tomorrow or make a prebooking." }
}, {
  timestamps: true
});

export default mongoose.model("Store", storeSchema);