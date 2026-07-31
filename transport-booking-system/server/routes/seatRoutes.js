import express from "express";
import { getSeatsByBus } from "../controllers/seatController.js";

const router = express.Router();

router.get("/:busId", getSeatsByBus);

export default router;