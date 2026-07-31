import pool from "../config/db.js";

export const getSeatsByBus = async (req, res) => {
    try {
        const { busId } = req.params;

        const result = await pool.query(
            `
            SELECT
                id,
                seat_number
            FROM seats
            WHERE bus_id = $1
            ORDER BY seat_number;
            `,
            [busId]
        );

        res.json({
            success: true,
            seats: result.rows,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch seats",
        });
    }
};