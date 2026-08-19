import { useEffect, useState } from "react";
import { getAdminBuses, createBus } from "../../api/adminApi";
import "./AdminBuses.css";

function AdminBuses() {
    const [buses, setBuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const [newBus, setNewBus] = useState({
        bus_number: "",
        capacity: ""
    });

    useEffect(() => {
        loadBuses();
    }, []);

    async function loadBuses() {
        try {
            const data = await getAdminBuses();
            setBuses(data.buses || []);
        } finally {
            setLoading(false);
        }
    }

    async function handleAddBus() {
    if (!newBus.bus_number || !newBus.capacity) {
        alert("Please fill in all fields.");
        return;
    }

    try {
        await createBus({
            bus_number: newBus.bus_number,
            capacity: Number(newBus.capacity)
        });

        await loadBuses();

        setShowModal(false);

        setNewBus({
            bus_number: "",
            capacity: ""
        });

    } catch (error) {
        alert(error.message);
    }
}

    if (loading) return <h2>Loading...</h2>;

    return (
        <section className="admin-buses">
            <div className="buses-header">
                <h1>Bus Management</h1>

                <button onClick={() => setShowModal(true)}>
                    + Add Bus
                </button>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="bus-modal">
                        <h2>Add Bus</h2>

                        <input
                            placeholder="Bus Number"
                            value={newBus.bus_number}
                            onChange={(e) =>
                                setNewBus({
                                    ...newBus,
                                    bus_number: e.target.value
                                })
                            }
                        />

                        <input
                            type="number"
                            placeholder="Seat Capacity"
                            value={newBus.capacity}
                            onChange={(e) =>
                                setNewBus({
                                    ...newBus,
                                    capacity: e.target.value
                                })
                            }
                        />

                        <div className="form-actions">
                            <button onClick={() => setShowModal(false)}>
                                Cancel
                            </button>

                            <button onClick={handleAddBus}>
                                Save Bus
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="buses-table">

            <table>
                <thead>
                    <tr>
                        <th>Bus Number</th>
                        <th>Capacity</th>
                    </tr>
                </thead>

                <tbody>
                    {buses.map((bus) => (
                        <tr key={bus.id}>
                            <td>{bus.bus_number}</td>
                            <td>{bus.capacity} Seats</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </section>
    );
}

export default AdminBuses;