import express from "express";
import { 
  getConsultations, 
  createConsultation, 
  updateConsultationStatus 
} from "../controllers/consultationController.js";

const router = express.Router();

router.get("/", getConsultations);
router.post("/", createConsultation);
router.patch("/:id/status", updateConsultationStatus);

export default router;