import { useEffect, useState } from "react";
import { getBookings } from "../../api/adminApi";

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
                            <td>{booking.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}

export default AdminBookings;