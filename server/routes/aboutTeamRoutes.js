import { Router } from "express";
import { getAboutTeam, upsertAboutTeam } from "../controllers/aboutTeamController.js";

const router = Router();

router.get("/", getAboutTeam);
router.put("/", upsertAboutTeam);

export default router;
