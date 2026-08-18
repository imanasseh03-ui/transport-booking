import express from "express";
import { 
    createBooking,
    getUserDashboard,
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

router.get("/", getBookings);

router.put("/:id", updateBookingStatus);


export default router;
