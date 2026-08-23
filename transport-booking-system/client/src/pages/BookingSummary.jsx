import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { createBooking, initializePayment } from "../api/bookingApi";
import { useAuth } from "../context/useAuth";

function BookingSummary() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();

    const bookingData = location.state;

    if (!bookingData) {
        return <Navigate to="/" replace />;
    }

    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from: location.pathname,
                    bookingData,
                }}
            />
        );
    }

    const bookingReference =
        bookingData.bookingReference || "Generated after confirmation";

   async function handleConfirmBooking() {
    try {
        // Use existing booking if available
        let booking = bookingData.booking;

        // Otherwise create a new pending booking
        if (!booking) {
            const bookingResponse = await createBooking({
                trip_id: bookingData.trip.id,
                seat_id: bookingData.seat.id,
            });

            booking = bookingResponse.booking;
        }

        // Initialize Paystack payment
        const payment = await initializePayment({
            bookingId: booking.id,
            email: bookingData.passenger.email,
            amount: bookingData.trip.fare,
        });

        // Redirect to Paystack
        window.location.href = payment.authorization_url;

    } catch (error) {
        alert(error.message);
    }
}

    return (
        <section className="booking-summary">
            <h1>Booking Confirmation</h1>

            <div className="summary-card">
                <h2>Booking Reference:</h2>
                <h3>{bookingReference}</h3>

                <hr />

                <h2>Trip Details</h2>

                <p>
                    Route: {bookingData.trip.origin}
                    {" -> "}
                    {bookingData.trip.destination}
                </p>

                <p>Bus: {bookingData.trip.bus_number}</p>

                <p>
                    Departure: {bookingData.trip.departure_date}{" "}
                    {bookingData.trip.departure_time}
                </p>

                <p>Passenger: {bookingData.passenger.fullName}</p>

                <p>Phone: {bookingData.passenger.phone}</p>

                <h2>
                    Amount Paid: NGN{" "}
                    {Number(bookingData.trip.fare).toLocaleString()}
                </h2>

                <p>Status: Pending Confirmation</p>

                <button className="confirm-btn" onClick={handleConfirmBooking}>
                    Pay ₦{Number(bookingData.trip.fare).toLocaleString()}
                </button>
            </div>
        </section>
    );
}

export default BookingSummary;
