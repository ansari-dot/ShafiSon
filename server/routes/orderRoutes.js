import { Router } from "express";
import { getOrders, getOrderByCode, updateOrderStatus, deleteOrder } from "../controllers/orderController.js";

const router = Router();

router.get("/", getOrders);
router.get("/:code", getOrderByCode);
router.put("/:code/status", updateOrderStatus);
router.delete("/:code", deleteOrder);

export default router;
