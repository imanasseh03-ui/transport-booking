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