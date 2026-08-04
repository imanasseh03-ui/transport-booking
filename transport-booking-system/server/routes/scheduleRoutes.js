import express from "express";
import { generateTripsController } from "../controllers/scheduleController.js";

const router = express.Router();

router.post("/generate", generateTripsController);

export default router;