import pool from "../config/db.js";

export const createBooking = async (req, res) => {
    try {
        const {
            routeId,
            fullName,
            phone,
            email,
        } = req.body;

        const bookingReference = 
            `BW-${Date.now().toString().slice(-6)}`;

            const query = `
            INSERT INTO bookings
            (
                booking_reference,
                route_id,
                full_name,
                phone,
                email
            )
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *;
                `;

                const values = [
                    bookingReference,
                    routeId,
                    fullName,
                    phone,
                    email
                ];

                const result = await pool.query(query, values);

                res.status(201).json({
                    success: true,
                    message: "Booking created successfully",
                    booking: result.rows[0],
                });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "server Error",
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