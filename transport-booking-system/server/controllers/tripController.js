import pool from "../config/db.js";

async function generateTripsForDate(date) {

    // Get all active schedules
    const schedules = await pool.query(`
        SELECT *
        FROM schedules
        WHERE active = TRUE
    `);

    for (const schedule of schedules.rows) {

        // Check if trip already exists
        const exists = await pool.query(
            `
            SELECT id
            FROM trips
            WHERE schedule_id = $1
            AND departure_date = $2
            `,
            [schedule.id, date]
        );

        // Create trip only if it doesn't already exist
        if (exists.rows.length === 0) {

            await pool.query(
                `
                INSERT INTO trips
                (
                    schedule_id,
                    route_id,
                    bus_id,
                    departure_date,
                    departure_time,
                    fare,
                    status
                )
                VALUES
                ($1, $2, $3, $4, $5, $6, 'Scheduled')
                `,
                [
                    schedule.id,
                    schedule.route_id,
                    schedule.bus_id,
                    date,
                    schedule.departure_time,
                    schedule.fare
                ]
            );
        }
    }
}

export const getTrips = async (req, res) => {
    try {

        const { origin, destination, date } = req.query;

        // Automatically generate trips for the searched date
        if (date) {
            await generateTripsForDate(date);
        }

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