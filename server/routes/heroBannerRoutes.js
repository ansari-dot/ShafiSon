import { Router } from "express";
import { getHeroBanner, upsertHeroBanner } from "../controllers/heroBannerController.js";

const router = Router();

router.get("/", getHeroBanner);
router.put("/", upsertHeroBanner);

export default router;
