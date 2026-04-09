import { Router } from "express";
import { getCompareSection, upsertCompareSection } from "../controllers/compareSectionController.js";

const router = Router();

router.get("/", getCompareSection);
router.put("/", upsertCompareSection);

export default router;
