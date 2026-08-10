import "./RoutesPage.css";
import { useNavigate } from "react-router-dom";
import routes from "../data/routes";
import { FaMapMarkerAlt, FaClock, FaMoneyBillWave } from "react-icons/fa";

function RoutesPage() {
    const navigate = useNavigate();

    const handleBookRoute = (route) => {
        navigate("/search-results", {
            state: {
                from: route.from,
                to: route.to,
                date: "",
                passengers: "1",
            },
        });
    };

    return (
        <section className="routes-page">

            <div className="routes-header">
                <h1>Our Routes</h1>

                <p>
                    Travel comfortably with Bluewhales between Abuja and Jos.
                </p>
            </div>

            <div className="routes-grid">

                {routes.map((route, index) => (

                    <div className="route-page-card" key={index}>

                        <div className="route-title">
                            <h2>
                                {route.from}
                            </h2>

                            <span>→</span>

                            <h2>
                                {route.to}
                            </h2>
                        </div>

                        <div className="route-details">

                            <p>
                                <FaClock className="route-icon" />
                                <strong>Duration:</strong>{" "}
                                {route.duration}
                            </p>

                            <p>
                                <FaMoneyBillWave className="route-icon" />
                                <strong>Fare:</strong>{" "}
                                {route.price}
                            </p>

                            <p>
                                <FaMapMarkerAlt className="route-icon" />
                                <strong>Departure:</strong>{" "}
                                {route.departure}
                            </p>

                        </div>

                        <button
                            onClick={() => handleBookRoute(route)}
                        >
                            Book This Route
                        </button>

                    </div>

                ))}

            </div>

        </section>
    );
}

export default RoutesPage;