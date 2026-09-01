import { useEffect, useState } from "react";
import { FaArrowRight, FaCalendarAlt, FaTicketAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/dashboard/DashboardLayout";

function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/bookings/mine`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Failed to load bookings");
                }

                setBookings(data.bookings || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const formatDate = (date) =>
        new Date(date).toLocaleDateString(undefined, {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
        });

    return (
        <DashboardLayout>
            <section className="dashboard-page-header">
                <div>
                    <span className="dashboard-eyebrow">Reservations</span>
                    <h1>My Bookings</h1>
                    <p>View your trip history, seats and booking references.</p>
                </div>

                <Link to="/book-trip" className="primary-action compact-action">
                    Book Trip
                </Link>
            </section>

            <section className="dashboard-panel">
                {loading && (
                    <div className="dashboard-state inline-state">
                        <h2>Loading bookings...</h2>
                        <p>Checking your latest reservations.</p>
                    </div>
                )}

                {error && (
                    <div className="dashboard-state dashboard-state-error inline-state">
                        <h2>Unable to load bookings</h2>
                        <p>{error}</p>
                    </div>
                )}

                {!loading && !error && bookings.length === 0 && (
                    <div className="empty-journey">
                        <FaTicketAlt />
                        <h3>No bookings yet</h3>
                        <p>Your confirmed and pending trips will appear here.</p>
                        <Link to="/book-trip" className="primary-action">
                            Book a Trip
                        </Link>
                    </div>
                )}

                {!loading && !error && bookings.length > 0 && (
                    <div className="booking-list">
                        {bookings.map((booking) => (
                            <article className="booking-item" key={booking.id}>
                                <div className="booking-item-icon">
                                    <FaCalendarAlt />
                                </div>

                                <div>
                                    <h2>
                                        {booking.origin} <FaArrowRight />{" "}
                                        {booking.destination}
                                    </h2>

                                    <p>
                                        {formatDate(booking.departure_date)} at{" "}
                                        {booking.departure_time}
                                    </p>

                                    <p>
                                        Seat {booking.seat_number} | Bus{" "}
                                        {booking.bus_number} | Ref{" "}
                                        {booking.booking_reference}
                                    </p>
                                </div>

                                <div className="booking-item-meta">
                                    <strong>
                                        NGN {Number(booking.fare).toLocaleString()}
                                    </strong>

                                    <span
                                        className={`status-badge ${booking.booking_status.toLowerCase()}`}
                                    >
                                        {booking.booking_status}
                                    </span>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </DashboardLayout>
    );
}

export default MyBookings;
