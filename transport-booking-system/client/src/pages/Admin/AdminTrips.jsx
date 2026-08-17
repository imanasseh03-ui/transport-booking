import { useEffect, useState } from "react";
import { getTrips, createTrip } from "../../api/adminApi";
import "./AdminTrips.css";

function AdminTrips() {

    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const [newTrip, setNewTrip] = useState({
        route_id: "",
        bus_id: "",
        departure_date: "",
        departure_time: "",
        fare: ""
    });

    useEffect(() => {
        loadTrips();
    }, []);

    async function loadTrips() {
        try {
            const data = await getTrips();
            setTrips(data.trips || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <h2>Loading trips...</h2>;

    async function handleAddTrip() {
        try {
            if (
                !newTrip.route_id ||
                !newTrip.bus_id ||
                !newTrip.departure_date ||
                !newTrip.departure_time ||
                !newTrip.fare
            ) {
                alert("Please fill in all fields.");
                return;
            }

            await createTrip({
                route_id: Number(newTrip.route_id),
                bus_id: Number(newTrip.bus_id),
                departure_date: newTrip.departure_date,
                departure_time: newTrip.departure_time,
                fare: Number(newTrip.fare)
            });

            await loadTrips();

            setShowModal(false);

            setNewTrip({
                route_id: "",
                bus_id: "",
                departure_date: "",
                departure_time: "",
                fare: ""
            });

        } catch (error) {
            alert(error.message);
        }
    }

    return (
        <section className="admin-trips">


            {showModal && (
                <div className="modal-overlay">
                    <div className="trip-modal">
                        <h2>Add New Trip</h2>

                        <input
                            type="text"
                            placeholder="Route ID"
                            value={newTrip.route_id}
                            onChange={(e) =>
                                setNewTrip({ ...newTrip, route_id: e.target.value })
                            }
                        />

                        <input
                            type="text"
                            placeholder="Bus ID"
                            value={newTrip.bus_id}
                            onChange={(e) =>
                                setNewTrip({ ...newTrip, bus_id: e.target.value })
                            }
                        />

                        <input
                            type="date"
                            value={newTrip.departure_date}
                            onChange={(e) =>
                                setNewTrip({ ...newTrip, departure_date: e.target.value })
                            }
                        />

                        <input
                            type="time"
                            value={newTrip.departure_time}
                            onChange={(e) =>
                                setNewTrip({ ...newTrip, departure_time: e.target.value })
                            }
                        />

                        <input
                            type="number"
                            placeholder="Fare"
                            value={newTrip.fare}
                            onChange={(e) =>
                                setNewTrip({ ...newTrip, fare: e.target.value })
                            }
                        />

                        <div className="form-actions">
                            <button
                                className="cancel-btn"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>

                            <button
                                className="primary-btn"
                                onClick={handleAddTrip}
                            >
                                Save Trip
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="trips-header">
                <h1>Trips Management</h1>

                <button
                    className="add-trip-btn"
                    onClick={() => setShowModal(true)}
                >
                    + Add Trip
                </button>
            </div>

            <div className="trips-table">

                <table>

                    <thead>
                        <tr>
                            <th>Route</th>
                            <th>Bus</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Fare</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>

                        {trips.map((trip) => (

                            <tr key={trip.id}>
                                <td>
                                    {trip.origin} → {trip.destination}
                                </td>

                                <td>
                                    {trip.bus_number}
                                </td>

                                <td>
                                    {trip.departure_date}
                                </td>

                                <td>
                                    {trip.departure_time}
                                </td>

                                <td>
                                    ₦{Number(trip.fare).toLocaleString()}
                                </td>

                                <td>
                                    {trip.status}
                                </td>
                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>



        </section>
    );
}

export default AdminTrips;