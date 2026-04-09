import { Router } from "express";
import { getHomeCollection, upsertHomeCollection } from "../controllers/homeCollectionController.js";

const router = Router();

router.get("/", getHomeCollection);
router.put("/", upsertHomeCollection);

export default router;
