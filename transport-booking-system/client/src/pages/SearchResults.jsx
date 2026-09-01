import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./SearchResults.css";

function SearchResults() {
    const location = useLocation();
    const navigate = useNavigate();

    const searchData = useMemo(
        () =>
            location.state || {
                from: "",
                to: "",
                date: "",
                passengers: "1",
            },
        [location.state]
    );

    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const params = new URLSearchParams({
                    origin: searchData.from,
                    destination: searchData.to,
                    date: searchData.date,
                });

                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/trips?${params.toString()}`
                );

                const data = await response.json();
                setTrips(data);
            } catch (error) {
                console.error("Failed to fetch trips:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrips();
    }, [searchData]);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    if (loading) {
        return <h2>Loading available trips...</h2>;
    }

    return (
        <section className="search-results">
            <h1>Available Trips</h1>

            <div className="trip-list">
                {trips.length > 0 ? (
                    trips.map((route) => (
                        <div className="trip-card" key={route.id}>
                            <div>
                                <h2>
                                    {route.origin} {" -> "} {route.destination}
                                </h2>

                                <p>
                                    Departure: {formatDate(route.departure_date)}
                                    {" "}
                                    {route.departure_time}
                                </p>

                                <p>Duration: {route.duration}</p>

                                <p>Bus: {route.bus_number}</p>
                            </div>

                            <div className="trip-price">
                                <h3>
                                    NGN {Number(route.fare).toLocaleString()}
                                </h3>

                                <p>{route.capacity} seats available</p>

                                <button
                                    onClick={() =>
                                        navigate("/book", {
                                            state: {
                                                trip: route,
                                            },
                                        })
                                    }
                                >
                                    Select Trip
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <h2>No trip available for this route.</h2>
                )}
            </div>
        </section>
    );
}

export default SearchResults;
