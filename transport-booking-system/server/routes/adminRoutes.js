import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

import {
    getDashboardStats
} from "../controllers/adminController.js";

const router = express.Router();

router.get(
    "/dashboard",
    authMiddleware,
    adminMiddleware,
    getDashboardStats
);

export default router;
