import { Router } from "express";
import { createContactLead, getContactLeads } from "../controllers/contactLeadController.js";

const router = Router();

router.get("/", getContactLeads);
router.post("/", createContactLead);

export default router;
