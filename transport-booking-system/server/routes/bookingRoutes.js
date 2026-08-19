import express from "express";
import { 
    createBooking,
    getUserDashboard,
    getUserBookings,
    getBookings,
    updateBookingStatus,
} from "../controllers/bookingController.js";

import authMiddleware from "../middleware/authMiddleware.js";


const router = express.Router();


router.post(
    "/", 
    authMiddleware, 
    createBooking
);

router.get(
    "/dashboard",
    authMiddleware,
    getUserDashboard
);

router.get(
    "/mine",
    authMiddleware,
    getUserBookings
);

router.get("/", getBookings);

router.put("/:id", updateBookingStatus);


export default router;
