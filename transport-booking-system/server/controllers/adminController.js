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
            SELECT COALESCE(SUM(fare), 0) AS revenue
            FROM bookings
            JOIN trips ON bookings.trip_id = trips.id
            WHERE bookings.booking_status = 'Confirmed'
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