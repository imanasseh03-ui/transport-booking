import express from "express";

const router = express.Router();

router.post("/", (req, res) => {
    console.log(req.body);

    res.status(201).json({
        success: true,
        message: "Booking received successfully",
    });
});

export default router;