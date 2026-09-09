import { useCallback, useEffect, useState } from "react";
import { getBookings, updateBookingStatus } from "../../api/adminApi";
import "./AdminBookings.css";

function AdminBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedBooking, setSelectedBooking] = useState(null);

    const loadBookings = useCallback(async () => {
        try {
            const data = await getBookings();

            setBookings(data.bookings || []);
        } catch (error) {
            console.error("Failed to load bookings:", error);

            alert("Failed to load bookings.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadBookings();
    }, [loadBookings]);

    async function handleStatusChange(id, status) {
        try {
            await updateBookingStatus(id, status);

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

    const filteredBookings = bookings.filter((booking) => {

        const search = searchTerm.toLowerCase();

        const matchesSearch =
            booking.booking_reference
                ?.toLowerCase()
                .includes(search) ||

            booking.full_name
                ?.toLowerCase()
                .includes(search) ||

            booking.phone
                ?.toLowerCase()
                .includes(search);

        const matchesStatus =
            statusFilter === "All" ||
            booking.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <section className="admin-bookings">

            {/* Header */}

            <div className="admin-bookings-header">

                <h1>BlueWhales Bookings</h1>

                <p>
                    Manage passenger bookings and booking statuses.
                </p>

            </div>

            {/* Statistics */}

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


            {/* Search and Filter */}

            <div className="booking-filters">

                <input
                    type="text"
                    placeholder="Search by reference, name or phone..."
                    value={searchTerm}
                    onChange={(e) =>
                        setSearchTerm(e.target.value)
                    }
                />

                <select
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(e.target.value)
                    }
                >
                    <option value="All">
                        All Statuses
                    </option>

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

                        {filteredBookings.length === 0 ? (

                            <tr>
                                <td colSpan="6">
                                    No bookings found.
                                </td>
                            </tr>

                        ) : (

                            filteredBookings.map((booking) => (

                                <tr
                                    key={booking.id}
                                    className="clickable-row"
                                    onClick={() => setSelectedBooking(booking)}
                                >

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
                                        <div className="trip-info">
                                            <strong>{booking.origin} → {booking.destination}</strong>
                                            <span>
                                                {booking.departure_date} • {booking.departure_time}
                                            </span>
                                        </div>
                                    </td>

                                    <td>
                                        {booking.seat_number ||
                                            `Seat #${booking.seat_id}`}
                                    </td>


                                    <td>
                                        <div
                                            className={`status-cell status-${booking.status.toLowerCase()}`}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {booking.status === "Completed" ? (
                                                <span className="status-badge">
                                                    Completed
                                                </span>
                                            ) : booking.status === "Cancelled" ? (
                                                <span className="status-badge">
                                                    Cancelled
                                                </span>
                                            ) : (
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
                                            )}
                                        </div>
                                    </td>


                                </tr>

                            ))

                        )}

                    </tbody>

                </table>
                {selectedBooking && (
                    <div
                        className="booking-modal-overlay"
                        onClick={() => setSelectedBooking(null)}
                    >
                        <div
                            className="booking-modal"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-header">
                                <h2>Booking Details</h2>

                                <button onClick={() => setSelectedBooking(null)}>
                                    ×
                                </button>
                            </div>

                            <div className="modal-content">

                                <div className="detail-group">
                                    <h4>Passenger</h4>
                                    <p><strong>Name:</strong> {selectedBooking.full_name}</p>
                                    <p><strong>Phone:</strong> {selectedBooking.phone}</p>
                                    <p><strong>Email:</strong> {selectedBooking.email}</p>
                                </div>

                                <div className="detail-group">
                                    <h4>Trip</h4>
                                    <p><strong>Route:</strong> {selectedBooking.origin} → {selectedBooking.destination}</p>

                                    <p><strong>Date:</strong> {selectedBooking.departure_date}</p>
                                    <p><strong>Time:</strong> {selectedBooking.departure_time}</p>
                                    <p><strong>Seat:</strong> {selectedBooking.seat_number}</p>
                                    <p>
                                        <strong>Fare:</strong> ₦
                                        {Number(selectedBooking.fare).toLocaleString()}
                                    </p>
                                </div>

                                <div className="detail-group">
                                    <h4>Booking</h4>
                                    <p><strong>Reference:</strong> {selectedBooking.booking_reference}</p>
                                    <p><strong>Status:</strong> {selectedBooking.status}</p>
                                </div>

                            </div>
                        </div>
                    </div>
                )}

            </div>

        </section>
    );
}

export default AdminBookings;
