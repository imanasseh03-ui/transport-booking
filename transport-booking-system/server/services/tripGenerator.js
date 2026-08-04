import pool from "../config/db.js";


export async function generateTrips(startDate, endDate) {
    const schedules = await pool.query(`
        SELECT *
        FROM schedules
        WHERE active = TRUE
    `);

    let generated = 0;

    for (const schedule of schedules.rows) {
        let current = new Date(startDate);
        const end = new Date(endDate);

        while (current <= end) {
            const date = current.toISOString().split("T")[0];

            const exists = await pool.query(
                `
                SELECT id
                FROM trips
                WHERE schedule_id = $1
                AND departure_date = $2
                `,
                [schedule.id, date]
            );

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
                    ($1,$2,$3,$4,$5,$6,'Scheduled')
                    `,
                    [
                        schedule.id,
                        schedule.route_id,
                        schedule.bus_id,
                        date,
                        schedule.departure_time,
                        schedule.fare,
                    ]
                );

                generated++;
            }

            current.setDate(current.getDate() + 1);
        }
    }

    return generated;
}