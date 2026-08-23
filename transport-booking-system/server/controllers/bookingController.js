import pool from "../config/db.js";

export const getUserDashboard = async (req, res) => {
    try {
        const userId = req.user.id;

        // Summary
        const statsQuery = await pool.query(
            `
            SELECT
                COUNT(*) AS total_bookings,

                COUNT(*) FILTER (
                    WHERE booking_status = 'Completed'
                ) AS total_trips

            FROM bookings
            WHERE user_id = $1
            `,
            [userId]
        );

        // Upcoming journey
        const upcomingJourneyQuery = await pool.query(
            `
            SELECT
                b.id,
                b.booking_reference,
                b.booking_status,

                r.origin,
                r.destination,

                bus.bus_number,

                t.departure_date,
                t.departure_time,

                s.seat_number

            FROM bookings b

            JOIN trips t
                ON b.trip_id = t.id

            JOIN routes r
                ON t.route_id = r.id

            JOIN buses bus
                ON t.bus_id = bus.id

            JOIN seats s
                ON b.seat_id = s.id

            WHERE b.user_id = $1
              AND b.booking_status = 'Confirmed'
              AND t.departure_date >= CURRENT_DATE

            ORDER BY
                t.departure_date,
                t.departure_time

            LIMIT 1
            `,
            [userId]
        );

        // Recent bookings
        const recentBookingsQuery = await pool.query(
            `
            SELECT
                b.id,
                b.booking_reference,
                b.booking_status,

                r.origin,
                r.destination,

                t.departure_date,
                t.departure_time,

                s.seat_number

            FROM bookings b

            JOIN trips t
                ON b.trip_id = t.id

            JOIN routes r
                ON t.route_id = r.id

            JOIN seats s
                ON b.seat_id = s.id

            WHERE b.user_id = $1

            ORDER BY b.created_at DESC

            LIMIT 5
            `,
            [userId]
        );

        const stats = statsQuery.rows[0];

        res.json({
            totalBookings: Number(stats.total_bookings),
            totalTrips: Number(stats.total_trips),

            upcomingJourney: upcomingJourneyQuery.rows[0] || null,

            recentBookings: recentBookingsQuery.rows,
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

        if (!trip_id || !seat_id) {
            return res.status(400).json({
                message: "Trip and seat are required",
            });
        }

        const user_id = req.user.id;

        const booking_reference =
            `BW${Date.now()}${Math.floor(Math.random() * 1000)}`;

        const seatForTrip = await pool.query(
            `
            SELECT
                trips.id AS trip_id,
                seats.id AS seat_id
            FROM trips
            JOIN seats
                ON seats.bus_id = trips.bus_id
            WHERE trips.id = $1
              AND seats.id = $2
            `,
            [trip_id, seat_id]
        );

        if (seatForTrip.rows.length === 0) {
            return res.status(400).json({
                message: "Selected seat is not available for this trip",
            });
        }

        // Check if this user already has a pending booking for this seat
        const existingPending = await pool.query(
            `
    SELECT *
    FROM bookings
    WHERE user_id = $1
      AND trip_id = $2
      AND seat_id = $3
      AND booking_status = 'Pending'
    LIMIT 1
    `,
            [user_id, trip_id, seat_id]
        );

        // Reuse the pending booking instead of creating another one
        if (existingPending.rows.length > 0) {
            return res.json({
                message: "Existing pending booking found",
                booking: existingPending.rows[0]
            });
        }

        // Check if the seat has already been confirmed by anyone
        const bookedSeat = await pool.query(
            `
    SELECT id
    FROM bookings
    WHERE trip_id = $1
      AND seat_id = $2
      AND booking_status IN ('Confirmed', 'Completed')
    LIMIT 1
    `,
            [trip_id, seat_id]
        );

        if (bookedSeat.rows.length > 0) {
            return res.status(409).json({
                message: "This seat has already been booked."
            });
        }



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

        if (
            error.code === "23505" &&
            error.constraint === "bookings_trip_id_seat_id_key"
        ) {

            return res.status(409).json({
                message:
                    "This seat has already been booked. Please select another seat."
            });

        }

        if (
            error.code === "23505" &&
            error.constraint === "bookings_booking_reference_key"
        ) {

            return res.status(409).json({
                message: "Booking reference conflict. Please try again.",
            });

        }

        res.status(500).json({
            message: "Failed to create booking"
        });

    }

};

export const getUserBookings = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            `
            SELECT
                bookings.id,
                bookings.booking_reference,
                bookings.booking_status,
                bookings.created_at,

                trips.departure_date,
                trips.departure_time,
                trips.fare,

                routes.origin,
                routes.destination,
                routes.duration,

                buses.bus_number,

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

            ORDER BY bookings.created_at DESC
            `,
            [userId]
        );

        res.json({
            success: true,
            bookings: result.rows,
        });

    } catch (error) {
        console.error("Get user bookings error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load your bookings",
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
