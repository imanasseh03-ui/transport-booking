import pool from "../config/db.js";


// ========================================
// GET DASHBOARD STATS
// ========================================

export const getDashboardStats = async (req, res) => {
    try {

        const bookingsResult = await pool.query(
            "SELECT COUNT(*) FROM bookings"
        );

        const tripsResult = await pool.query(
            "SELECT COUNT(*) FROM trips"
        );

        const routesResult = await pool.query(
            "SELECT COUNT(*) FROM routes"
        );

        const busesResult = await pool.query(
            "SELECT COUNT(*) FROM buses"
        );

        const usersResult = await pool.query(
            "SELECT COUNT(*) FROM users WHERE role = 'user'"
        );

        const revenueResult = await pool.query(
            `
            SELECT COALESCE(SUM(trips.fare), 0) AS revenue
            FROM bookings
            JOIN trips
                ON bookings.trip_id = trips.id
            WHERE bookings.booking_status = 'Confirmed'
            `
        );

        res.json({
            totalBookings: Number(bookingsResult.rows[0].count),
            totalTrips: Number(tripsResult.rows[0].count),
            totalRoutes: Number(routesResult.rows[0].count),
            totalBuses: Number(busesResult.rows[0].count),
            totalUsers: Number(usersResult.rows[0].count),
            revenue: Number(revenueResult.rows[0].revenue),
        });

    } catch (error) {

        console.error(
            "Dashboard stats error:",
            error
        );

        res.status(500).json({
            message: "Failed to load dashboard statistics",
        });
    }
};


// ========================================
// GET ALL TRIPS
// ========================================

export const getAllTrips = async (req, res) => {
    try {

        const result = await pool.query(
            `
            SELECT
                trips.id,
                trips.route_id,
                trips.bus_id,
                routes.origin,
                routes.destination,
                buses.bus_number,
                buses.capacity,
                trips.departure_date,
                trips.departure_time,
                trips.fare,
                trips.status
            FROM trips
            JOIN routes
                ON trips.route_id = routes.id
            JOIN buses
                ON trips.bus_id = buses.id
            ORDER BY
                trips.departure_date ASC,
                trips.departure_time ASC
            `
        );

        res.json({
            trips: result.rows,
        });

    } catch (error) {

        console.error(
            "Get trips error:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch trips",
        });
    }
};


// ========================================
// ADD TRIP
// ========================================

export const addTrip = async (req, res) => {
    try {

        const {
            route_id,
            bus_id,
            departure_date,
            departure_time,
            fare
        } = req.body;


        if (
            !route_id ||
            !bus_id ||
            !departure_date ||
            !departure_time ||
            fare === undefined
        ) {
            return res.status(400).json({
                message: "All trip fields are required",
            });
        }


        const result = await pool.query(
            `
            INSERT INTO trips
            (
                route_id,
                bus_id,
                departure_date,
                departure_time,
                fare,
                status
            )
            VALUES
            ($1, $2, $3, $4, $5, 'Scheduled')
            RETURNING *
            `,
            [
                route_id,
                bus_id,
                departure_date,
                departure_time,
                fare
            ]
        );


        res.status(201).json({
            message: "Trip added successfully",
            trip: result.rows[0],
        });

    } catch (error) {

        console.error(
            "Add trip error:",
            error
        );

        res.status(500).json({
            message: "Failed to add trip",
        });
    }
};


// ========================================
// UPDATE TRIP
// ========================================

export const updateTrip = async (req, res) => {
    try {

        const { id } = req.params;

        const {
            route_id,
            bus_id,
            departure_date,
            departure_time,
            fare,
            status
        } = req.body;


        const result = await pool.query(
            `
            UPDATE trips
            SET
                route_id = $1,
                bus_id = $2,
                departure_date = $3,
                departure_time = $4,
                fare = $5,
                status = COALESCE($6, status)
            WHERE id = $7
            RETURNING *
            `,
            [
                route_id,
                bus_id,
                departure_date,
                departure_time,
                fare,
                status,
                id
            ]
        );


        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Trip not found",
            });
        }


        res.json({
            message: "Trip updated successfully",
            trip: result.rows[0],
        });

    } catch (error) {

        console.error(
            "Update trip error:",
            error
        );

        res.status(500).json({
            message: "Failed to update trip",
        });
    }
};


// ========================================
// DELETE TRIP
// ========================================

export const deleteTrip = async (req, res) => {
    try {

        const { id } = req.params;


        const result = await pool.query(
            `
            DELETE FROM trips
            WHERE id = $1
            RETURNING id
            `,
            [id]
        );


        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Trip not found",
            });
        }


        res.json({
            message: "Trip deleted successfully",
        });

    } catch (error) {

        console.error(
            "Delete trip error:",
            error
        );

        res.status(500).json({
            message: "Failed to delete trip",
        });
    }
};


// ========================================
// GET ROUTES
// ========================================

export const getRoutes = async (req, res) => {
    try {

        const result = await pool.query(
            `
            SELECT
                id,
                origin,
                destination
            FROM routes
            ORDER BY origin ASC
            `
        );


        res.json({
            routes: result.rows,
        });

    } catch (error) {

        console.error(
            "Get routes error:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch routes",
        });
    }
};


// ========================================
// GET BUSES
// ========================================

export const getBuses = async (req, res) => {
    try {

        const result = await pool.query(
            `
            SELECT
                id,
                bus_number,
                capacity,
                plate_number,
                status
            FROM buses
            ORDER BY bus_number ASC
            `
        );


        res.json({
            buses: result.rows,
        });

    } catch (error) {

        console.error(
            "Get buses error:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch buses",
        });
    }
};


// ========================================
// GET ALL BOOKINGS
// ========================================

export const getAllBookings = async (req, res) => {
    try {

        const result = await pool.query(
            `
            SELECT
                bookings.id,
                bookings.booking_reference,
                bookings.booking_status,
                bookings.created_at,

                users.id AS user_id,
                users.full_name,
                users.email,
                users.phone,

                trips.id AS trip_id,
                trips.departure_date,
                trips.departure_time,
                trips.fare,

                routes.origin,
                routes.destination,

                buses.bus_number,

                seats.seat_number

            FROM bookings

            JOIN users
                ON bookings.user_id = users.id

            JOIN trips
                ON bookings.trip_id = trips.id

            JOIN routes
                ON trips.route_id = routes.id

            JOIN buses
                ON trips.bus_id = buses.id

            JOIN seats
                ON bookings.seat_id = seats.id

            ORDER BY bookings.created_at DESC
            `
        );


        res.json({
            bookings: result.rows,
        });

    } catch (error) {

        console.error(
            "Get bookings error:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch bookings",
        });
    }
};


// ========================================
// UPDATE BOOKING STATUS
// ========================================

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
                message: "Invalid booking status",
            });
        }


        // Get current booking status
        const currentBooking = await pool.query(
            `
            SELECT booking_status
            FROM bookings
            WHERE id = $1
            `,
            [id]
        );


        if (currentBooking.rows.length === 0) {
            return res.status(404).json({
                message: "Booking not found",
            });
        }


        const currentStatus =
            currentBooking.rows[0].booking_status;


        // Completed bookings cannot be cancelled
        if (
            currentStatus === "Completed" &&
            status === "Cancelled"
        ) {
            return res.status(400).json({
                message:
                    "A completed booking cannot be cancelled",
            });
        }


        const result = await pool.query(
            `
            UPDATE bookings
            SET booking_status = $1
            WHERE id = $2
            RETURNING *
            `,
            [
                status,
                id
            ]
        );


        res.json({
            message: "Booking status updated successfully",
            booking: result.rows[0],
        });

    } catch (error) {

        console.error(
            "Update booking status error:",
            error
        );

        res.status(500).json({
            message: "Failed to update booking status",
        });
    }
};


// ========================================
// GET ALL USERS
// ========================================

export const getAllUsers = async (req, res) => {
    try {

        const result = await pool.query(
            `
            SELECT
                users.id,
                users.full_name,
                users.email,
                users.phone,
                users.role,
                users.email_verified,
                users.created_at,
                COUNT(bookings.id)::INTEGER AS bookings_count
            FROM users

            LEFT JOIN bookings
                ON users.id = bookings.user_id

            GROUP BY
                users.id

            ORDER BY
                users.created_at DESC
            `
        );


        res.json({
            users: result.rows,
        });

    } catch (error) {

        console.error(
            "Get users error:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch users",
        });
    }
};


// ========================================
// GET ALL BUSES
// ========================================

export const getAllBuses = async (req, res) => {
    try {

        const result = await pool.query(
            `
            SELECT
                id,
                bus_number,
                capacity,
                plate_number,
                status
            FROM buses
            ORDER BY bus_number ASC
            `
        );


        res.json({
            buses: result.rows,
        });

    } catch (error) {

        console.error(
            "Get all buses error:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch buses",
        });
    }
};


// ========================================
// ADD BUS
// ========================================

export const addBus = async (req, res) => {
    try {

        const {
            bus_number,
            capacity,
            plate_number,
            status
        } = req.body;


        if (
            !bus_number ||
            !capacity ||
            !plate_number
        ) {
            return res.status(400).json({
                message:
                    "Bus number, capacity and plate number are required",
            });
        }


        const result = await pool.query(
            `
            INSERT INTO buses
            (
                bus_number,
                capacity,
                plate_number,
                status
            )
            VALUES
            ($1, $2, $3, COALESCE($4, 'Available'))
            RETURNING *
            `,
            [
                bus_number,
                capacity,
                plate_number,
                status
            ]
        );


        res.status(201).json({
            message: "Bus added successfully",
            bus: result.rows[0],
        });

    } catch (error) {

        console.error(
            "Add bus error:",
            error
        );


        // Duplicate bus number / plate number
        if (error.code === "23505") {
            return res.status(400).json({
                message:
                    "Bus number or plate number already exists",
            });
        }


        res.status(500).json({
            message: "Failed to add bus",
        });
    }
};
