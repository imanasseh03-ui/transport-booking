import { generateTrips } from "../services/tripGenerator.js";

export const generateTripsController = async (req, res) => {
    try {
        const { startDate, endDate } = req.body;

        const generated = await generateTrips(startDate, endDate);

        res.json({
            success: true,
            generated,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to generate trips",
        });
    }
};