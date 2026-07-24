import { useEffect, useState } from "react";
import { getBookings, updateBookingStatus } from "../../api/adminApi";

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
            console.error(error);
            alert("Failed to load bookings.");
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <h2>Loading bookings...</h2>;
    }

    async function handleStatusChange(id, status) {
        try {
            await updateBookingStatus(id, status);

            //Reload the latest bookings
            await loadBookings();
        } catch (error) {
            console.error(error);
            alert("Failed to upade booking.");
        }
    }

    return (
        <section className="admin-bookings">
            <h1>BlueWhales Bookings</h1>

            <table>
                <thead>
                    <tr>
                        <th>Reference</th>
                        <th>Passenger</th>
                        <th>Phone</th>
                        <th>Status</th>
                    </tr>
                </thead>

                <tbody>
                    {bookings.map((booking) => (
                        <tr key={booking.id}>
                            <td>{booking.booking_reference}</td>
                            <td>{booking.full_name}</td>
                            <td>{booking.phone}</td>
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
                                    <option value="Pending">Pending</option>
                                    <option value="Confirmed">Confirmed</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}

export default AdminBookings;