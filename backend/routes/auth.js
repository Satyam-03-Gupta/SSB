import express from "express";
import { signup, login } from "../controllers/authController.js";

const router = express.Router();
router.get("/test", (req, res) => {
  res.json({ message: "Auth routes working" });
});
router.post("/signup", signup);
router.post("/login", login);

export default router;
