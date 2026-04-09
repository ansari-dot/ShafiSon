import { Router } from "express";
import { getDealSection, upsertDealSection } from "../controllers/dealSectionController.js";

const router = Router();

router.get("/", getDealSection);
router.put("/", upsertDealSection);

export default router;
