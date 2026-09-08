import pool from "../config/db.js";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
const CLIENT_URL = process.env.CLIENT_URL;

export const initializePayment = async (req, res) => {
    try {
        const { bookingId, email, amount } = req.body;

        const reference = `BW-${Date.now()}`;

        const response = await fetch(
            "https://api.paystack.co/transaction/initialize",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    amount: amount * 100,
                    reference,
                    callback_url: `${CLIENT_URL}/payment-success`,
                    metadata: {
                        bookingId,
                    },
                }),
            }
        );

        const data = await response.json();

        console.log("Payment request:", {
            bookingId,
            email,
            amount,
        });

        console.log("Paystack response:", data);

        if (!data.status) {
            await pool.query(
                `
                UPDATE bookings
                SET booking_status = 'Cancelled'
                WHERE id = $1
                  AND booking_status = 'Pending'
                `,
                [bookingId]
            );

            return res.status(400).json({
                message: data.message || "Failed to initialize payment",
            });
        }

        await pool.query(
            `
            INSERT INTO payments
            (
                booking_id,
                amount,
                payment_method,
                transaction_reference,
                payment_status
            )
            VALUES ($1, $2, 'Paystack', $3, 'Pending')
            `,
            [bookingId, amount, reference]
        );

        res.json({
            authorization_url: data.data.authorization_url,
            reference,
        });

    } catch (error) {
        console.error("Payment initialization error:", error);

        if (req.body?.bookingId) {
            await pool.query(
                `
                UPDATE bookings
                SET booking_status = 'Cancelled'
                WHERE id = $1
                  AND booking_status = 'Pending'
                `,
                [req.body.bookingId]
            );
        }

        res.status(500).json({
            message: "Payment initialization failed",
        });
    }
};


export const verifyPayment = async (req, res) => {
    try {
        const { reference } = req.params;

        // -----------------------------------------
        // 1. Find the payment in our database
        // -----------------------------------------

        const paymentResult = await pool.query(
            `
            SELECT
                id,
                booking_id,
                amount,
                payment_status,
                transaction_reference
            FROM payments
            WHERE transaction_reference = $1
            `,
            [reference]
        );

        if (paymentResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Payment record not found.",
            });
        }

        const payment = paymentResult.rows[0];


        // -----------------------------------------
        // 2. Verify transaction with Paystack
        // -----------------------------------------

        const response = await fetch(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET}`,
                },
            }
        );

        const data = await response.json();

        console.log("Paystack verification response:", data);


        // -----------------------------------------
        // 3. Check Paystack response
        // -----------------------------------------

        if (
            !data.status ||
            !data.data ||
            data.data.status !== "success"
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment was not successful.",
            });
        }


        // -----------------------------------------
        // 4. Verify payment amount
        // -----------------------------------------

        const paystackAmount = Number(data.data.amount) / 100;
        const databaseAmount = Number(payment.amount);

        if (paystackAmount !== databaseAmount) {
            return res.status(400).json({
                success: false,
                message: "Payment amount does not match the booking amount.",
            });
        }


        // -----------------------------------------
        // 5. Update payment
        // -----------------------------------------

        await pool.query(
            `
            UPDATE payments
            SET
                payment_status = 'Paid',
                payment_method = 'Paystack',
                paid_at = NOW()
            WHERE transaction_reference = $1
            `,
            [reference]
        );


        // -----------------------------------------
        // 6. Confirm booking
        // -----------------------------------------

        await pool.query(
            `
            UPDATE bookings
            SET booking_status = 'Confirmed'
            WHERE id = $1
            `,
            [payment.booking_id]
        );


        // -----------------------------------------
        // 7. Get complete receipt information
        // -----------------------------------------

        const receiptResult = await pool.query(
            `
            SELECT
                p.id AS payment_id,
                p.amount,
                p.payment_method,
                p.payment_status,
                p.transaction_reference,
                p.paid_at,

                b.id AS booking_id,
                b.booking_reference,
                b.booking_status,
                b.created_at AS booking_created_at,

                u.full_name,
                u.email,
                u.phone,

                s.seat_number,

                t.id AS trip_id,
                t.departure_date,
                t.departure_time,
                t.fare,

                r.origin,
                r.destination,
                r.distance_km,
                r.duration

            FROM payments p

            INNER JOIN bookings b
                ON p.booking_id = b.id

            INNER JOIN users u
                ON b.user_id = u.id

            INNER JOIN seats s
                ON b.seat_id = s.id

            INNER JOIN trips t
                ON b.trip_id = t.id

            INNER JOIN routes r
                ON t.route_id = r.id

            WHERE p.transaction_reference = $1
            `,
            [reference]
        );

        if (receiptResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Payment was verified, but receipt information could not be found.",
            });
        }

        const receipt = receiptResult.rows[0];


        // -----------------------------------------
        // 8. Send receipt to frontend
        // -----------------------------------------

        res.json({
            success: true,
            message: "Payment verified successfully.",

            payment: {
                id: receipt.payment_id,
                amount: receipt.amount,
                method: receipt.payment_method,
                status: receipt.payment_status,
                reference: receipt.transaction_reference,
                paid_at: receipt.paid_at,
            },

            customer: {
                name: receipt.full_name,
                email: receipt.email,
                phone: receipt.phone,
            },

            booking: {
                id: receipt.booking_id,
                reference: receipt.booking_reference,
                status: receipt.booking_status,
                created_at: receipt.booking_created_at,
            },

            trip: {
                id: receipt.trip_id,
                origin: receipt.origin,
                destination: receipt.destination,
                departure_date: receipt.departure_date,
                departure_time: receipt.departure_time,
                fare: receipt.fare,
                seat_number: receipt.seat_number,
                distance_km: receipt.distance_km,
                duration: receipt.duration,
            },
        });

    } catch (error) {
        console.error("Payment verification error:", error);

        res.status(500).json({
            success: false,
            message: "Verification failed.",
        });
    }
};
