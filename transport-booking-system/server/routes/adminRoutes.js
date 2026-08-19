import express from "express";

import verifyToken from "../middleware/authMiddleware.js";
import verifyAdmin from "../middleware/adminMiddleware.js";

import {
    getDashboardStats,
    getAllTrips,
    addTrip,
    updateTrip,
    deleteTrip,
    getRoutes,
    getBuses,
    getAllBookings,
    updateBookingStatus,
    getAllUsers,
    getAllBuses,
    addBus
} from "../controllers/adminController.js";


const router = express.Router();

router.get("/dashboard", verifyToken, verifyAdmin, getDashboardStats);
router.get("/trips", verifyToken, verifyAdmin, getAllTrips);
router.post("/trips", verifyToken, verifyAdmin, addTrip);
router.put("/trips/:id", verifyToken, verifyAdmin, updateTrip);
router.delete("/trips/:id", verifyToken, verifyAdmin, deleteTrip);

router.get("/routes", verifyToken, verifyAdmin, getRoutes);
router.get("/buses", verifyToken, verifyAdmin, getBuses);

router.get("/bookings", verifyToken, verifyAdmin, getAllBookings);
router.put("/bookings/:id", verifyToken, verifyAdmin, updateBookingStatus);
router.get("/users", verifyToken, verifyAdmin, getAllUsers);
router.get("/buses", verifyToken, verifyAdmin, getAllBuses);
router.post("/buses", verifyToken, verifyAdmin, addBus);

export default router;
