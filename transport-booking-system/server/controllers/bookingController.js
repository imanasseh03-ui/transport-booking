import pool from "../config/db.js";

export const createBooking = async (req, res) => {

    try {

        const {
            trip_id,
            seat_id
        } = req.body;

        const user_id = req.user.id;

        const booking_reference =
            "BW" + Date.now();

        const result = await pool.query(
            `
            INSERT INTO bookings
            (
                user_id,
                trip_id,
                seat_id,
                booking_reference
            )
            VALUES
            ($1, $2, $3, $4)
            RETURNING *
            `,
            [
                user_id,
                trip_id,
                seat_id,
                booking_reference
            ]
        );

        res.status(201).json({
            message: "Booking created successfully",
            booking: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        // Seat is already booked for this trip
        if (error.code === "23505") {

            return res.status(409).json({
                message:
                    "This seat has already been booked. Please select another seat."
            });

        }

        res.status(500).json({
            message: "Failed to create booking"
        });

    }

};

export const getBookings = async (req, res) => {
    try {

        const result = await pool.query(
            `
            SELECT *
            FROM bookings
            ORDER BY created_at DESC
            `
        );

        res.json({
            success: true,
            bookings: result.rows,
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

export const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const result = await pool.query(
            `
            UPDATE bookings
            SET status = $1
            WHERE id = $2
            RETURNING *;
            `,
            [status, id]
        );

        if(result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }

        res.json({
            success: true,
            booking: result.rows[0],
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
} ;