import "./PopularRoutes.css";
import routes from "../../data/routes";
import { FaMapMarkerAlt, FaClock, FaMoneyBillWave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function PopularRoutes() {
    const navigate = useNavigate();

    const handleBookNow = (route) => {
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
        <section className="popular-routes">
            <h2>Popular Routes</h2>
            <p>Choose from our most frequently traveled routes.</p>

            <div className="routes-container">
                {routes.map((route, index) => (
                    <div className="route-card" key={index}>

                        <h3>
                            {route.from} <span>→</span> {route.to}
                        </h3>

                        <div className="route-info">

                            <p>
                                <FaClock className="icon" />
                                {route.duration}
                            </p>

                            <p>
                                <FaMoneyBillWave className="icon" />
                                {route.price}
                            </p>

                            <p>
                                <FaMapMarkerAlt className="icon" />
                                Departure: {route.departure}
                            </p>

                        </div>

                        <button onClick={() => handleBookNow(route)}>
                            Book Now
                        </button>

                    </div>
                ))}
            </div>
        </section>
    );
}

export default PopularRoutes;