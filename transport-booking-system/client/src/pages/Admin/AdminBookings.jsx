import { useEffect, useState } from "react";
import { getBookings, updateBookingStatus } from "../../api/adminApi";
import "./AdminBookings.css";

function AdminBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBookings();
    }, []);

    async function loadBookings() {
        try {
            const data = await getBookings();

            setBookings(data.bookings);
        } catch (error) {
            console.error("Failed to load bookings:", error);

            alert("Failed to load bookings.");
        } finally {
            setLoading(false);
        }
    }

    async function handleStatusChange(id, status) {
        try {
            await updateBookingStatus(id, status);

            // Reload the latest bookings
            await loadBookings();
        } catch (error) {
            console.error("Failed to update booking:", error);

            alert("Failed to update booking.");
        }
    }

    if (loading) {
        return <h2>Loading bookings...</h2>;
    }

    const totalBookings = bookings.length;

    const pendingBookings = bookings.filter(
        (booking) => booking.status === "Pending"
    ).length;

    const confirmedBookings = bookings.filter(
        (booking) => booking.status === "Confirmed"
    ).length;

    const completedBookings = bookings.filter(
        (booking) => booking.status === "Completed"
    ).length;

    return (
        <section className="admin-bookings">

            <div className="admin-bookings-header">
                <h1>BlueWhales Bookings</h1>

                <p>
                    Manage passenger bookings and booking statuses.
                </p>
            </div>

            {/* Booking Statistics */}

            <div className="dashboard-cards">

                <div className="card">
                    <h3>Total Bookings</h3>
                    <h2>{totalBookings}</h2>
                </div>

                <div className="card">
                    <h3>Pending</h3>
                    <h2>{pendingBookings}</h2>
                </div>

                <div className="card">
                    <h3>Confirmed</h3>
                    <h2>{confirmedBookings}</h2>
                </div>

                <div className="card">
                    <h3>Completed</h3>
                    <h2>{completedBookings}</h2>
                </div>

            </div>

            {/* Bookings Table */}

            <div className="bookings-table-container">

                <table>

                    <thead>
                        <tr>
                            <th>Reference</th>
                            <th>Passenger</th>
                            <th>Phone</th>
                            <th>Trip</th>
                            <th>Seat</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>

                        {bookings.length === 0 ? (

                            <tr>
                                <td colSpan="6">
                                    No bookings found.
                                </td>
                            </tr>

                        ) : (

                            bookings.map((booking) => (

                                <tr key={booking.id}>

                                    <td>
                                        {booking.booking_reference}
                                    </td>

                                    <td>
                                        {booking.full_name}
                                    </td>

                                    <td>
                                        {booking.phone}
                                    </td>

                                    <td>
                                        {booking.departure_date} at {booking.departure_time}
                                    </td>

                                    <td>
                                        {booking.seat_number ||
                                            `Seat #${booking.seat_id}`}
                                    </td>

                                    <td>

                                        <select
                                            value={booking.status}
                                            onChange={(e) =>
                                                handleStatusChange(
                                                    booking.id,
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="Pending">
                                                Pending
                                            </option>

                                            <option value="Confirmed">
                                                Confirmed
                                            </option>

                                            <option value="Completed">
                                                Completed
                                            </option>

                                            <option value="Cancelled">
                                                Cancelled
                                            </option>
                                        </select>

                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            </div>

        </section>
    );
}

export default AdminBookings;
