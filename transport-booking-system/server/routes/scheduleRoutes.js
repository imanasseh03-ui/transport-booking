import express from "express";
import { generateTrips } from "../controllers/scheduleController.js";

const router = express.Router();

router.post("/generate", generateTrips);

export default router;