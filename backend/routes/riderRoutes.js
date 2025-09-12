import express from "express";
import { riderLogin, getRiderOrders, getSingleOrder, updateOrderStatus } from "../controllers/riderController.js";
import riderAuth from "../middleware/riderAuth.js";

const router = express.Router();

router.post("/login", riderLogin);
router.get("/orders", riderAuth, getRiderOrders);
router.get("/orders/:orderId", riderAuth, getSingleOrder);
router.put("/orders/:orderId/status", riderAuth, updateOrderStatus);

export default router;