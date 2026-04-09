import { Router } from "express";
import { initPayfast, payfastNotify } from "../controllers/payfastController.js";

const router = Router();

router.post("/init", initPayfast);
router.post("/notify", payfastNotify);

export default router;
