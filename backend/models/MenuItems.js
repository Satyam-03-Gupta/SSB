import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  img: { type: String },
  button: { type: String, default: "Order Now" },
  closed: { type: Boolean, default: false }
});

export default mongoose.model("MenuItem", menuItemSchema);
