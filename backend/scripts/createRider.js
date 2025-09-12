import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Rider from "../models/Rider.js";

dotenv.config();

const createRider = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const hashedPassword = await bcrypt.hash("rider123", 12);
    
    const rider = new Rider({
      name: "John Rider",
      email: "rider@ssb.com",
      password: hashedPassword,
      phone: "9876543210",
      vehicleNumber: "TN01AB1234"
    });
    
    await rider.save();
    console.log("Rider created successfully!");
    console.log("Email: rider@ssb.com");
    console.log("Password: rider123");
    
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

createRider();