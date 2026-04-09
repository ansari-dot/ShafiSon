import { Router } from "express";
import { getHomeCategories, upsertHomeCategories } from "../controllers/homeCategoriesController.js";

const router = Router();

router.get("/", getHomeCategories);
router.put("/", upsertHomeCategories);

export default router;
