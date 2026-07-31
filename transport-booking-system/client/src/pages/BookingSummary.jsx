import { useLocation, Navigate } from "react-router-dom";
import { createBooking } from "../api/bookingApi";

function BookingSummary() {

    const location = useLocation();

    const bookingData = location.state;

    if (!bookingData) {
        return <Navigate to="/" replace />;
    }


    const bookingReference =
        `BW-${Date.now().toString().slice(-6)}`;

    const handleConfirmBooking = async () => {

        try {

            const response = await createBooking({
                routeId: bookingData.trip.id,
                fullName: bookingData.passenger.fullName,
                phone: bookingData.passenger.phone,
                email: bookingData.passenger.email,
            });

            console.log(response);

            alert("Booking Successful!");

        } catch (error) {

            console.error(error);

            alert("Booking Failed");

        }

    };


    return (
        <section className="booking-summary">

            <h1>
                Booking Confirmation
            </h1>


            <div className="summary-card">

                <h2>
                    Booking Reference:
                </h2>

                <h3>
                    {bookingReference}
                </h3>


                <hr />


                <h2>
                    Trip Details
                </h2>


                <p>
                    Route:
                    {" "}
                    {bookingData.trip.origin}
                    {" → "}
                    {bookingData.trip.destination}
                </p>


                <p>
                    Bus:
                    {" "}
                    {bookingData.trip.bus_number}
                </p>


                <p>
                    Departure:
                    {" "}
                    {bookingData.trip.departure_date} {bookingData.trip.departure_time}
                </p>


                <p>
                    Passenger:
                    {" "}
                    {bookingData.passenger.fullName}
                </p>


                <p>
                    Phone:
                    {" "}
                    {bookingData.passenger.phone}
                </p>


                <h2>
                    Amount Paid:
                    {" "}
                   ₦{Number(bookingData.trip.fare).toLocaleString()}
                </h2>


                <p>
                    Status:
                    Pending Confirmation
                </p>

                <button onClick={handleConfirmBooking}>
                    Confirm Booking
                </button>


            </div>

        </section>
    );
}


export default BookingSummary;