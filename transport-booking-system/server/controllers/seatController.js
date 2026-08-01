import pool from "../config/db.js";

export const getSeatsByBus = async (req, res) => {
    try {

        const { busId } = req.params;


        const result = await pool.query(
            `
            SELECT
                seats.id,
                seats.seat_number,
                CASE
                    WHEN bookings.id IS NOT NULL THEN 'Booked'
                    ELSE 'Available'
                END AS status

            FROM seats

            LEFT JOIN bookings
            ON seats.id = bookings.seat_id

            WHERE seats.bus_id = $1

            ORDER BY seats.seat_number;
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