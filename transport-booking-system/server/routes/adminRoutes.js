import express from "express";

import verifyToken from "../middleware/authMiddleware.js";
import verifyAdmin from "../middleware/adminMiddleware.js";

import {
    getDashboardStats,
    getAllTrips,
    addTrip
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/dashboard", verifyToken, verifyAdmin, getDashboardStats);
router.get("/trips", verifyToken, verifyAdmin, getAllTrips);
router.post("/trips", verifyToken, verifyAdmin, addTrip);

export default router;
