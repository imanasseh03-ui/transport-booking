import { useMemo, useState } from "react";
import { FaExchangeAlt, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import routes from "../data/routes";

function BookTrip() {
    const navigate = useNavigate();
    const today = new Date().toISOString().split("T")[0];
    const locations = useMemo(
        () => Array.from(new Set(routes.flatMap((route) => [route.from, route.to]))),
        []
    );

    const [form, setForm] = useState({
        from: routes[0]?.from || "",
        to: routes[0]?.to || "",
        date: today,
        passengers: "1",
    });

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };

    const swapLocations = () => {
        setForm({
            ...form,
            from: form.to,
            to: form.from,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        navigate("/search-results", {
            state: form,
        });
    };

    return (
        <DashboardLayout>
            <section className="dashboard-page-header">
                <div>
                    <span className="dashboard-eyebrow">Travel Search</span>
                    <h1>Book Trip</h1>
                    <p>Choose a route and travel date to see available buses.</p>
                </div>
            </section>

            <section className="dashboard-panel">
                <form className="dashboard-form" onSubmit={handleSubmit}>
                    <label>
                        Departure
                        <select
                            name="from"
                            value={form.from}
                            onChange={handleChange}
                            required
                        >
                            {locations.map((location) => (
                                <option key={location} value={location}>
                                    {location}
                                </option>
                            ))}
                        </select>
                    </label>

                    <button
                        type="button"
                        className="icon-action"
                        onClick={swapLocations}
                        aria-label="Swap departure and destination"
                        title="Swap departure and destination"
                    >
                        <FaExchangeAlt />
                    </button>

                    <label>
                        Destination
                        <select
                            name="to"
                            value={form.to}
                            onChange={handleChange}
                            required
                        >
                            {locations.map((location) => (
                                <option key={location} value={location}>
                                    {location}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Travel Date
                        <input
                            type="date"
                            name="date"
                            min={today}
                            value={form.date}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label>
                        Passengers
                        <select
                            name="passengers"
                            value={form.passengers}
                            onChange={handleChange}
                        >
                            <option value="1">1 Passenger</option>
                            <option value="2">2 Passengers</option>
                            <option value="3">3 Passengers</option>
                            <option value="4">4 Passengers</option>
                        </select>
                    </label>

                    <button type="submit" className="primary-action form-action">
                        <FaSearch />
                        Search Trips
                    </button>
                </form>
            </section>
        </DashboardLayout>
    );
}

export default BookTrip;
