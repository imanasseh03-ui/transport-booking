import express from "express";
import { getSeatsByTrip } from "../controllers/seatController.js";

const router = express.Router();

router.get("/trip/:tripId", getSeatsByTrip);

export default router;