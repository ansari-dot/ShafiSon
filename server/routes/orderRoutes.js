import { Router } from "express";
import { getOrders, getOrderByCode, updateOrderStatus } from "../controllers/orderController.js";

const router = Router();

router.get("/", getOrders);
router.get("/:code", getOrderByCode);
router.put("/:code/status", updateOrderStatus);

export default router;
