import { Router } from "express";
import {
  getProducts,
  getProductNavigation,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { invalidateCache } from "../app.js";

const router = Router();
const bust = (req, res, next) => { invalidateCache("/api/products"); next(); };

router.get("/", getProducts);
router.get("/navigation", getProductNavigation);
router.get("/:id", getProductById);
router.post("/", createProduct, bust);
router.put("/:id", updateProduct, bust);
router.delete("/:id", deleteProduct, bust);

export default router;
