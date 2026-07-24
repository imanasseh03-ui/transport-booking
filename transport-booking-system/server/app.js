import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./config/db.js";
import bookingRoutes from "./routes/bookingRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.send("Transport Booking API is running...");
});

// Booking routes
app.use("/api/bookings", bookingRoutes);

export default app;