import pool from "../config/db.js";

export const getUserDashboard = async (req, res) => {
    try {
        const userId = req.user.id;

        const statsQuery = await pool.query(
            `
            SELECT
                COUNT(bookings.id) AS total_bookings,
                COUNT(*) FILTER (
                    WHERE bookings.booking_status IN ('Confirmed', 'Completed')
                ) AS total_trips,
                COUNT(DISTINCT trips.route_id) AS total_routes,
                COUNT(DISTINCT trips.bus_id) AS total_buses,
                COALESCE(
                    SUM(trips.fare) FILTER (
                        WHERE bookings.booking_status = 'Confirmed'
                    ),
                    0
                ) AS revenue
            FROM bookings
            JOIN trips
                ON bookings.trip_id = trips.id
            WHERE bookings.user_id = $1
            `,
            [userId]
        );

        const upcomingJourneyQuery = await pool.query(
            `
            SELECT
                bookings.id,
                bookings.booking_reference,
                bookings.booking_status,
                routes.origin,
                routes.destination,
                buses.bus_number,
                trips.departure_date,
                trips.departure_time,
                trips.fare,
                seats.seat_number
            FROM bookings
            JOIN trips
                ON bookings.trip_id = trips.id
            JOIN routes
                ON trips.route_id = routes.id
            JOIN buses
                ON trips.bus_id = buses.id
            JOIN seats
                ON bookings.seat_id = seats.id
            WHERE bookings.user_id = $1
              AND bookings.booking_status != 'Cancelled'
              AND trips.departure_date >= CURRENT_DATE
            ORDER BY trips.departure_date ASC,
                     trips.departure_time ASC
            LIMIT 1
            `,
            [userId]
        );

        const stats = statsQuery.rows[0];

        res.json({
            totalBookings: Number(stats.total_bookings),
            totalTrips: Number(stats.total_trips),
            totalRoutes: Number(stats.total_routes),
            totalBuses: Number(stats.total_buses),
            revenue: Number(stats.revenue),
            upcomingJourney: upcomingJourneyQuery.rows[0] || null,
        });
    } catch (error) {
        console.error("User dashboard error:", error);

        res.status(500).json({
            message: "Failed to load dashboard",
        });
    }
};

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
            SELECT
                bookings.id,
                bookings.booking_reference,
                bookings.booking_status AS status,
                bookings.created_at,

                users.full_name,
                users.email,
                users.phone,

                bookings.trip_id,
                trips.departure_date,
                trips.departure_time,
                trips.fare,

                bookings.seat_id,
                seats.seat_number

            FROM bookings

            JOIN users
                ON bookings.user_id = users.id

            JOIN trips
                ON bookings.trip_id = trips.id

            JOIN seats
                ON bookings.seat_id = seats.id

            ORDER BY bookings.created_at DESC
            `
        );

        res.json({
            success: true,
            bookings: result.rows,
        });

    } catch (error) {
        console.error("Get bookings error:", error);

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

        const allowedStatuses = [
            "Pending",
            "Confirmed",
            "Completed",
            "Cancelled"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid booking status",
            });
        }

        const result = await pool.query(
            `
            UPDATE bookings
            SET booking_status = $1
            WHERE id = $2
            RETURNING *;
            `,
            [status, id]
        );

        if (result.rows.length === 0) {
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
        console.error("Update booking status error:", error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};
