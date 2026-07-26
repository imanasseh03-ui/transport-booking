import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./config/db.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Transport Booking API is running...");
});

app.use("/api/bookings", bookingRoutes);

app.use("/api/auth", authRoutes);

export default app;