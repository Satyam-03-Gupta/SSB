import jwt from "jsonwebtoken";
import Rider from "../models/Rider.js";

const riderAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return res.status(401).json({ message: "Access denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const rider = await Rider.findById(decoded.riderId);
    
    if (!rider) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.riderId = rider._id;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export default riderAuth;