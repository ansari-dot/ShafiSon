import { Router } from "express";
import { getPopularPicks, upsertPopularPicks } from "../controllers/popularPicksController.js";

const router = Router();

router.get("/", getPopularPicks);
router.put("/", upsertPopularPicks);

export default router;
