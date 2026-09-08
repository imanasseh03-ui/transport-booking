import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "./PaymentSuccess.css";
import logo from "../assets/images/logo.png";

function PaymentSuccess() {
    const [searchParams] = useSearchParams();

    const [status, setStatus] = useState("verifying");
    const [message, setMessage] = useState("");
    const [receipt, setReceipt] = useState(null);

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                const reference = searchParams.get("reference");

                if (!reference) {
                    setStatus("error");
                    setMessage("Payment reference was not found.");
                    return;
                }

                const token = localStorage.getItem("token");

                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/payment/verify/${reference}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Payment verification failed"
                    );
                }

                setReceipt(data);
                setStatus("success");
                setMessage(data.message || "Payment verified successfully.");

            } catch (error) {
                console.error("Payment verification error:", error);

                setStatus("error");
                setMessage(error.message);
            }
        };

        verifyPayment();
    }, [searchParams]);


    // -----------------------------------------
    // Loading / Verification
    // -----------------------------------------

    if (status === "verifying") {
        return (
            <div className="payment-page">
                <div className="payment-loading">
                    <div className="payment-spinner"></div>

                    <h2>Verifying Payment</h2>

                    <p>
                        Please wait while we confirm your payment.
                    </p>
                </div>
            </div>
        );
    }


    // -----------------------------------------
    // Error
    // -----------------------------------------

    if (status === "error") {
        return (
            <div className="payment-page">
                <div className="payment-error-card">

                    <div className="payment-error-icon">
                        !
                    </div>

                    <h1>Payment Verification Failed</h1>

                    <p>{message}</p>

                    <Link
                        to="/bookings"
                        className="payment-primary-btn"
                    >
                        Go to My Bookings
                    </Link>

                </div>
            </div>
        );
    }


    // -----------------------------------------
    // Successful payment
    // -----------------------------------------

    const payment = receipt?.payment;
    const customer = receipt?.customer;
    const booking = receipt?.booking;
    const trip = receipt?.trip;


    const formatDate = (date) => {
        if (!date) return "—";

        return new Date(date).toLocaleDateString("en-NG", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };


    const formatDateTime = (date) => {
        if (!date) return "—";

        return new Date(date).toLocaleString("en-NG", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };


    const formatTime = (time) => {
        if (!time) return "—";

        const [hours, minutes] = time.split(":");

        const date = new Date();

        date.setHours(hours);
        date.setMinutes(minutes);

        return date.toLocaleTimeString("en-NG", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };


    return (
        <div className="payment-page">

            <div className="payment-container">

                {/* -------------------------------- */}
                {/* Header */}
                {/* -------------------------------- */}

                <div className="payment-success-header">

                    <div className="success-check">
                        ✓
                    </div>

                    <h1>Payment Successful</h1>

                    <p>
                        Your payment has been verified successfully.
                    </p>

                    <span className="payment-status-badge">
                        <span>✓</span>
                        Paid
                    </span>

                </div>


                {/* -------------------------------- */}
                {/* Receipt */}
                {/* -------------------------------- */}

                <div className="payment-receipt" id="payment-receipt">

                    {/* Receipt heading */}

                    <div className="receipt-header">

                        <div className="brand">

                            <img
                                src={logo}
                                alt="Bluewhales logo"
                                className="brand-logo"
                            />

                            <div>
                                <h2>Bluewhales</h2>
                                <p>Travel made simple. Enjoy peace & comfort.</p>
                            </div>

                        </div>

                        <div className="receipt-label">
                            PAYMENT RECEIPT
                        </div>

                    </div>


                    {/* Amount */}

                    <div className="amount-section">

                        <span>Amount Paid</span>

                        <h2>
                            ₦{Number(payment?.amount || 0).toLocaleString(
                                "en-NG",
                                {
                                    minimumFractionDigits: 2,
                                }
                            )}
                        </h2>

                        <p>
                            Payment completed successfully
                        </p>

                    </div>


                    {/* Payment information */}

                    <div className="receipt-section">

                        <div className="section-heading">
                            <span className="section-icon">₦</span>
                            <h3>Payment Details</h3>
                        </div>

                        <div className="details-grid">

                            <div className="detail-item">
                                <span>Payment ID</span>
                                <strong>
                                    #{payment?.id || "—"}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>Transaction Reference</span>
                                <strong className="reference">
                                    {payment?.reference || "—"}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>Payment Method</span>
                                <strong>
                                    {payment?.method || "Paystack"}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>Status</span>
                                <strong className="paid-text">
                                    {payment?.status || "Paid"}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>Payment Date</span>
                                <strong>
                                    {formatDateTime(payment?.paid_at)}
                                </strong>
                            </div>

                        </div>

                    </div>


                    <div className="receipt-divider"></div>


                    {/* Customer information */}

                    <div className="receipt-section">

                        <div className="section-heading">
                            <span className="section-icon">👤</span>
                            <h3>Customer Details</h3>
                        </div>

                        <div className="details-grid">

                            <div className="detail-item">
                                <span>Full Name</span>
                                <strong>
                                    {customer?.name || "—"}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>Email Address</span>
                                <strong>
                                    {customer?.email || "—"}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>Phone Number</span>
                                <strong>
                                    {customer?.phone || "—"}
                                </strong>
                            </div>

                        </div>

                    </div>


                    <div className="receipt-divider"></div>


                    {/* Trip information */}

                    <div className="receipt-section">

                        <div className="section-heading">
                            <span className="section-icon">🚌</span>
                            <h3>Trip Details</h3>
                        </div>


                        <div className="route-display">

                            <div className="route-location">
                                <span>FROM</span>
                                <strong>{trip?.origin || "—"}</strong>
                            </div>

                            <div className="route-line">

                                <div className="route-dot"></div>

                                <div className="route-arrow">
                                    →
                                </div>

                                <div className="route-dot"></div>

                            </div>

                            <div className="route-location destination">
                                <span>TO</span>
                                <strong>{trip?.destination || "—"}</strong>
                            </div>

                        </div>


                        <div className="details-grid trip-grid">

                            <div className="detail-item">
                                <span>Travel Date</span>
                                <strong>
                                    {formatDate(trip?.departure_date)}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>Departure Time</span>
                                <strong>
                                    {formatTime(trip?.departure_time)}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>Seat Number</span>
                                <strong className="seat-number">
                                    {trip?.seat_number || "—"}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>Booking Status</span>
                                <strong className="confirmed-text">
                                    {booking?.status || "Confirmed"}
                                </strong>
                            </div>

                        </div>

                    </div>


                    <div className="receipt-divider"></div>


                    {/* Booking reference */}

                    <div className="booking-reference">

                        <span>BOOKING REFERENCE</span>

                        <strong>
                            {booking?.reference || "—"}
                        </strong>

                    </div>


                    {/* Footer */}

                    <div className="receipt-footer">

                        <p>
                            Thank you for choosing Bluewhales.
                        </p>

                        <span>
                            Travel made simple. Enjoy peace & comfort.
                        </span>

                    </div>

                </div>


                {/* -------------------------------- */}
                {/* Actions */}
                {/* -------------------------------- */}

                <div className="payment-actions">

                    <button
                        className="payment-secondary-btn"
                        onClick={() => window.print()}
                    >
                        🖨 Print Receipt
                    </button>

                    <Link
                        to="/bookings"
                        className="payment-primary-btn"
                    >
                        View My Bookings
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default PaymentSuccess;
