import pool from "../config/db.js";


export const getSeatsByTrip = async (req, res) => {
    try {

        const { tripId } = req.params;


        const result = await pool.query(
            `
            SELECT
                seats.id,
                seats.seat_number,

                CASE
                    WHEN bookings.id IS NOT NULL 
                    THEN 'Booked'
                    ELSE 'Available'
                END AS status


            FROM trips

            JOIN seats
            ON seats.bus_id = trips.bus_id


            LEFT JOIN bookings
            ON bookings.seat_id = seats.id
            AND bookings.trip_id = trips.id
            AND bookings.booking_status != 'Cancelled'


            WHERE trips.id = $1


            ORDER BY seats.seat_number;
            `,
            [tripId]
        );


        res.json({
            success: true,
            seats: result.rows,
        });


    } catch(error) {

        console.error(error);

        res.status(500).json({
            success:false,
            message:"Failed to fetch trip seats"
        });

    }
};
