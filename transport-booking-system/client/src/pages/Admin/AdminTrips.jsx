import { useEffect, useState } from "react";
import { getTrips, createTrip, updateTrip, getRoutes, getBuses } from "../../api/adminApi";
import "./AdminTrips.css";

function AdminTrips() {

    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTrip, setEditingTrip] = useState(null);
    const [routes, setRoutes] = useState([]);
    const [buses, setBuses] = useState([]);


    const [newTrip, setNewTrip] = useState({
        route_id: "",
        bus_id: "",
        departure_date: "",
        departure_time: "",
        fare: ""
    });

    useEffect(() => {
        loadTrips();
        loadRoutes();
        loadBuses();
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

    async function loadRoutes() {
        try {
            const data = await getRoutes();
            setRoutes(data.routes || []);
        } catch (error) {
            console.error(error);
        }

    }

    async function loadBuses() {
        try {
            const data = await getBuses();
            setBuses(data.buses || []);
        } catch (error) {
            console.error(error);
        }
    }

    function handleEditClick(trip) {
        setEditingTrip(trip);

        setNewTrip({
            route_id: trip.route_id,
            bus_id: trip.bus_id,
            departure_date: trip.departure_date.split("T")[0],
            departure_time: trip.departure_time.slice(0, 5),
            fare: trip.fare
        });

        setShowModal(true);
    }


    async function handleAddTrip() {
        try {
            if (editingTrip) {
    await updateTrip(editingTrip.id, {
        route_id: Number(newTrip.route_id),
        bus_id: Number(newTrip.bus_id),
        departure_date: newTrip.departure_date,
        departure_time: newTrip.departure_time,
        fare: Number(newTrip.fare)
    });
} else {
    await createTrip({
        route_id: Number(newTrip.route_id),
        bus_id: Number(newTrip.bus_id),
        departure_date: newTrip.departure_date,
        departure_time: newTrip.departure_time,
        fare: Number(newTrip.fare)
    });
}

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
                        <h2>{editingTrip ? "Edit Trip" : "Add New Trip"}</h2>

                        <select
                            value={newTrip.route_id}
                            onChange={(e) =>
                                setNewTrip({ ...newTrip, route_id: e.target.value })
                            }
                        >
                            <option value="">Select Route</option>

                            {routes.map((route) => (
                                <option key={route.id} value={route.id}>
                                    {route.origin} → {route.destination}
                                </option>
                            ))}
                        </select>

                        <select
                            value={newTrip.bus_id}
                            onChange={(e) =>
                                setNewTrip({ ...newTrip, bus_id: e.target.value })
                            }
                        >
                            <option value="">Select Bus</option>

                            {buses.map((bus) => (
                                <option key={bus.id} value={bus.id}>
                                    {bus.bus_number}
                                </option>
                            ))}
                        </select>

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
                                {editingTrip ? "Update Trip" : "Save Trip"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="trips-header">
                <h1>Trips Management</h1>

                <button
                    className="add-trip-btn"
                    onClick={() => {
                        setEditingTrip(null);
                        setNewTrip({
                            route_id: "",
                            bus_id: "",
                            departure_date: "",
                            departure_time: "",
                            fare: ""
                        });
                        setShowModal(true);
                    }}
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
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>

                        {trips.map((trip) => (

                            <tr key={trip.id}>
                                <td>{trip.origin} → {trip.destination}</td>

                                <td>{trip.bus_number}</td>

                                <td>{trip.departure_date}</td>

                                <td>{trip.departure_time}</td>

                                <td>₦{Number(trip.fare).toLocaleString()}</td>

                                <td>{trip.status}</td>

                                <td>
                                    <button
                                        className="edit-btn"
                                        onClick={() => handleEditClick(trip)}
                                    >
                                        Edit
                                    </button>
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