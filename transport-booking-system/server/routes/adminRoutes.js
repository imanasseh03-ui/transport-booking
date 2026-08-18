import express from "express";

import verifyToken from "../middleware/authMiddleware.js";
import verifyAdmin from "../middleware/adminMiddleware.js";

import {
    getDashboardStats,
    getAllTrips,
    addTrip,
    updateTrip,
    getRoutes,
    getBuses
} from "../controllers/adminController.js";


const router = express.Router();

router.get("/dashboard", verifyToken, verifyAdmin, getDashboardStats);
router.get("/trips", verifyToken, verifyAdmin, getAllTrips);
router.post("/trips", verifyToken, verifyAdmin, addTrip);
router.put("/trips/:id", verifyToken, verifyAdmin, updateTrip);

router.get("/routes", verifyToken, verifyAdmin, getRoutes);
router.get("/buses", verifyToken, verifyAdmin, getBuses);

export default router;
