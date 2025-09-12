import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import menuRoutes from "./routes/menuRoute.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";

dotenv.config();
const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// Connect DB
import connectDB from "./config/db.js";
connectDB();

// Add sample data
import MenuItem from "./models/MenuItems.js";
import Rider from "./models/Rider.js";
import Subscription from "./models/Subscription.js";
import bcrypt from "bcryptjs";

const addSampleData = async () => {
  try {
    const count = await MenuItem.countDocuments();
    if (count === 0) {
      await MenuItem.insertMany([
        { name: "Price List", img: "/assets/menu1.jpg", button: "Order Now", closed: false },
        { name: "Sunday SPL", img: "/assets/menu2.jpg", button: "Order Now", closed: false },
        { name: "Friday Offer", img: "/assets/menu4.jpg", button: "Order Now", closed: false },
        { name: "Holiday Update", img: "/assets/menu3.jpg", button: "Shop Closed", closed: true }
      ]);
      console.log("Sample menu data added");
    }
    
    // Add default rider
    const riderCount = await Rider.countDocuments();
    if (riderCount === 0) {
      const hashedPassword = await bcrypt.hash("rider123", 12);
      await Rider.create({
        name: "John Rider",
        email: "rider@ssb.com",
        password: hashedPassword,
        phone: "9876543210",
        vehicleNumber: "TN01AB1234"
      });
      console.log("Default rider created - Email: rider@ssb.com, Password: rider123");
    }
    
    // Remove test orders
    await Subscription.deleteMany({
      item: "biryani",
      phone: "9803698953"
    });
    console.log("Test orders cleaned up");
  } catch (error) {
    console.log("Error adding sample data:", error.message);
  }
};
setTimeout(addSampleData, 2000);

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend connected!", timestamp: new Date() });
});

// Test auth routes
app.get("/api/auth/test", (req, res) => {
  res.json({ message: "Auth routes working!" });
});

app.post("/api/auth/test-signup", (req, res) => {
  res.json({ message: "Signup route working!", body: req.body });
});

// Routes
import authRoutes from "./routes/auth.js";
import contactRoutes from "./routes/contactRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import riderRoutes from "./routes/riderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/rider", riderRoutes);
app.use("/api", paymentRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
