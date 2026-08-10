import { useLocation, Navigate, Link } from "react-router-dom";

function BookingSuccess() {
    const location = useLocation();

    const booking = location.state;

    if (!booking) {
        return <Navigate to="/" replace />;
    }

    return (
        <section className="booking-success">
            <h1>🎉 Booking Confirmed!</h1>

            <p>
                Your booking has been created successfully.
            </p>

            <div className="success-card">

                <p>
                    <strong>Booking Reference:</strong>{" "}
                    {booking.booking_reference}
                </p>

                <p>
                    <strong>Status:</strong>{" "}
                    {booking.booking_status}
                </p>

            </div>

            <Link to="/dashboard">
                <button>
                    View My Bookings
                </button>
            </Link>

        </section>
    )
}

export default BookingSuccess;