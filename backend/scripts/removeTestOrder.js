import mongoose from "mongoose";
import dotenv from "dotenv";
import Subscription from "../models/Subscription.js";

dotenv.config();

const removeTestOrder = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const result = await Subscription.deleteMany({
      item: "biryani",
      phone: "9803698953",
      deliveryLocation: {
        address: "No:26/25, 2nd Floor, Agaram Main Rd., Ranganatha Nagar, Balaji Nagar, Selaiyur, Chennai, Tamil Nadu"
      }
    });
    
    console.log(`Removed ${result.deletedCount} test orders`);
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

removeTestOrder();