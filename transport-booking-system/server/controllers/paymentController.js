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
                    amount: amount * 100, // Convert ₦ to kobo
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
            amount
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
                transaction_reference,
                payment_status
            )
            VALUES ($1,$2,$3,'Pending')
            `,
            [bookingId, amount, reference]
        );

        res.json({
            authorization_url: data.data.authorization_url,
            reference,
        });

    } catch (error) {
        console.error(error);

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

        const response = await fetch(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET}`,
                },
            }
        );

        const data = await response.json();

        if (
            !data.status ||
            data.data.status !== "success"
        ) {
            return res.status(400).json({
                message: "Payment not successful",
            });
        }

        await pool.query(
            `
            UPDATE payments
            SET
                payment_status='Paid',
                paid_at=NOW()
            WHERE transaction_reference=$1
            `,
            [reference]
        );

        const payment = await pool.query(
            `
            SELECT booking_id
            FROM payments
            WHERE transaction_reference=$1
            `,
            [reference]
        );

        await pool.query(
            `
            UPDATE bookings
            SET booking_status='Confirmed'
            WHERE id=$1
            `,
            [payment.rows[0].booking_id]
        );

        res.json({
            success: true,
            message: "Payment verified",
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Verification failed",
        });
    }
};
