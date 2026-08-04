import pool from "../config/db.js";
import { generateTrips } from "../services/tripGenerator.js";



export const getTrips = async (req, res) => {
    try {

        const { origin, destination, date } = req.query;

        if (date) {
            await generateTrips(date, date);
        }

        // Automatically generate trips for the searched date

        let query = `
            SELECT
                trips.id,
                routes.origin,
                routes.destination,
                routes.duration,
                trips.departure_date,
                trips.departure_time,
                trips.fare,
                buses.bus_number,
                buses.capacity
            FROM trips
            JOIN routes
                ON trips.route_id = routes.id
            JOIN buses
                ON trips.bus_id = buses.id
            WHERE trips.status = 'Scheduled'
        `;

        const values = [];

        if (origin) {
            values.push(origin);
            query += ` AND routes.origin = $${values.length}`;
        }

        if (destination) {
            values.push(destination);
            query += ` AND routes.destination = $${values.length}`;
        }

        if (date) {
            values.push(date);
            query += ` AND trips.departure_date = $${values.length}`;
        }

        query += `
            ORDER BY
                trips.departure_date,
                trips.departure_time
        `;

        const { rows } = await pool.query(query, values);

        res.status(200).json(rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch trips"
        });

    }
};