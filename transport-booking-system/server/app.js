import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./config/db.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import tripRoutes from "./routes/tripRoutes.js";
import seatRoutes from "./routes/seatRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js"


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Transport Booking API is running...");
});

app.use("/api/bookings", bookingRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/seats", seatRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/payment", paymentRoutes);


export default app;