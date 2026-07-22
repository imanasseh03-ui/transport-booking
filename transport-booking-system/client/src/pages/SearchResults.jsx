import "./SearchResults.css";
import routes from "../data/routes";
import { useLocation, useNavigate } from "react-router-dom";

function SearchResults() {
    const location = useLocation();
    const searchData = location.state || {
        from: "",
        to: "",
        date: "",
        passangers: "1",
    };

    const filterRoutes = routes.filter((route) => {
        return (
            route.from === searchData.from &&
            route.to === searchData.to
        );

    });

    const navigate = useNavigate();
    return (
        <section className="search-results">

            <h1>
                Available Trips
            </h1>

            <div className="trip-list">
                {filterRoutes.length > 0 ? (

                    filterRoutes.map((route) => (

                        <div className="trip-card" key={route.id}>

                            <div>
                                <h2>
                                    {route.from} → {route.to}
                                </h2>

                                <p>
                                    Departure: {route.departure}
                                </p>

                                <p>
                                    Duration: {route.duration}
                                </p>

                                <p>
                                    Bus: {route.bus}
                                </p>
                            </div>


                            <div className="trip-price">

                                <h3>
                                    ₦{route.price.toLocaleString()}
                                </h3>

                                <p>
                                    {route.availableSeats} seats available
                                </p>

                                <button
                                    onClick={() =>
                                        navigate("/book", {
                                            state: {
                                                route,
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