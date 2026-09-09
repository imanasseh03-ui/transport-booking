import pool from "../config/db.js";


export const getDashboardStats = async (req, res) => {
    try {

        const totalBookingsQuery =
            await pool.query("SELECT COUNT(*) FROM bookings");

        const totalTripsQuery =
            await pool.query("SELECT COUNT(*) FROM trips");

        const totalRoutesQuery =
            await pool.query("SELECT COUNT(*) FROM routes");

        const totalBusesQuery =
            await pool.query("SELECT COUNT(*) FROM buses");

        const revenueQuery = await pool.query(`
            SELECT COALESCE(SUM(t.fare), 0) AS revenue
            FROM bookings b
            JOIN trips t ON b.trip_id = t.id
            WHERE b.booking_status IN ('Confirmed', 'Completed')
        `);

        res.status(200).json({
            totalBookings: Number(totalBookingsQuery.rows[0].count),
            totalTrips: Number(totalTripsQuery.rows[0].count),
            totalRoutes: Number(totalRoutesQuery.rows[0].count),
            totalBuses: Number(totalBusesQuery.rows[0].count),
            revenue: Number(revenueQuery.rows[0].revenue),
        });

    } catch (error) {
        console.error("Dashboard Error:", error);

        res.status(500).json({
            message: "Failed to load dashboard statistics",
            error: error.message,
        });
    }
};




export const getAllTrips = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                trips.id,
                routes.origin,
                routes.destination,
                buses.bus_number,
                trips.departure_date,
                trips.departure_time,
                trips.fare,
                trips.status

            FROM trips

            JOIN routes
                ON trips.route_id = routes.id

            JOIN buses
                ON trips.bus_id = buses.id

            ORDER BY trips.departure_date ASC,
                     trips.departure_time ASC
        `);

        res.json({
            success: true,
            trips: result.rows,
        });

    } catch (error) {
        console.error("Get trips error:", error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

export const addTrip = async (req, res) => {
    try {
        const {
            route_id,
            bus_id,
            departure_date,
            departure_time,
            fare
        } = req.body;

        const result = await pool.query(
            `INSERT INTO trips
            (route_id, bus_id, departure_date, departure_time, fare)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [
                route_id,
                bus_id,
                departure_date,
                departure_time,
                fare
            ]
        );

        res.status(201).json({
            success: true,
            message: "Trip created successfully",
            trip: result.rows[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to create trip"
        });
    }
};

export const updateTrip = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            route_id,
            bus_id,
            departure_date,
            departure_time,
            fare
        } = req.body;

        const result = await pool.query(
            `UPDATE trips
             SET route_id = $1,
                 bus_id = $2,
                 departure_date = $3,
                 departure_time = $4,
                 fare = $5
             WHERE id = $6
             RETURNING *`,
            [
                route_id,
                bus_id,
                departure_date,
                departure_time,
                fare,
                id
            ]
        );

        res.json({
            success: true,
            message: "Trip updated successfully",
            trip: result.rows[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to update trip"
        });
    }
};

export const deleteTrip = async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query(
            "DELETE FROM trips WHERE id = $1",
            [id]
        );

        res.json({
            success: true,
            message: "Trip deleted successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to delete trip"
        });
    }
};

export const getRoutes = async (req, res) => {
    const result = await pool.query(
        "SELECT id, origin, destination FROM routes ORDER BY origin"
    );

    res.json({
        success: true,
        routes: result.rows
    });
};

export const getBuses = async (req, res) => {
    const result = await pool.query(
        "SELECT id, bus_number FROM buses ORDER BY bus_number"
    );

    res.json({
        success: true,
        buses: result.rows
    });
};

export const getAllBookings = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                b.id,
                b.booking_reference,
                b.booking_status AS status,

                u.full_name,
                u.phone,
                u.email,

                s.seat_number,

                t.departure_date,
                t.departure_time,
                t.fare,

                r.origin,
                r.destination

            FROM bookings b
            JOIN users u ON b.user_id = u.id
            JOIN trips t ON b.trip_id = t.id
            JOIN routes r ON t.route_id = r.id
            JOIN seats s ON b.seat_id = s.id

            ORDER BY b.created_at DESC
        `);

        res.json({
            success: true,
            bookings: result.rows
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to load bookings"
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

        // Make sure the status is valid
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid booking status"
            });
        }

        // Get current booking
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
                success: false,
                message: "Booking not found"
            });
        }

        const currentStatus =
            currentBooking.rows[0].booking_status;


        // Completed bookings are final
        if (currentStatus === "Completed") {
            return res.status(400).json({
                success: false,
                message: "Completed bookings cannot be changed"
            });
        }


        const result = await pool.query(
            `
            UPDATE bookings
            SET booking_status = $1
            WHERE id = $2
            RETURNING *
            `,
            [status, id]
        );

        res.json({
            success: true,
            message: "Booking status updated successfully",
            booking: result.rows[0]
        });

    } catch (error) {

        console.error("Update booking status error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update booking status"
        });
    }
};


export const getAllUsers = async (req, res) => {
    try{
        const result = await pool.query(`
            SELECT
                id,
                full_name,
                email,
                phone,
                role,
                created_at
            FROM users
            ORDER BY created_at DESC
            
            `);

            res.json({
                success: true,
                users: result.rows
            });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to load users"
        });
    }
};

export const getAllBuses = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT id, bus_number, capacity
            FROM buses
            ORDER BY bus_number
        `);

        res.json({
            success: true,
            buses: result.rows
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to load buses"
        });
    }
};

export const addBus = async (req, res) => {
    try {
        const { bus_number, capacity } = req.body;

        const result = await pool.query(
            `INSERT INTO buses (bus_number, capacity)
             VALUES ($1, $2)
             RETURNING *`,
            [bus_number, capacity]
        );

        res.status(201).json({
            success: true,
            bus: result.rows[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to add bus"
        });
    }
};