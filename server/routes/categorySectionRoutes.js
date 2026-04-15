import { Router } from "express";
import {
  getCategorySections,
  createCategorySection,
  updateCategorySection,
  deleteCategorySection,
} from "../controllers/categorySectionController.js";

const router = Router();

router.get("/", getCategorySections);
router.post("/", createCategorySection);
router.put("/:id", updateCategorySection);
router.delete("/:id", deleteCategorySection);

export default router;
