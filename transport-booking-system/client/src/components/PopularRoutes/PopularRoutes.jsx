import "./PopularRoutes.css";
import { FaMapMarkerAlt, FaClock, FaMoneyBillWave } from "react-icons/fa";

function PopularRoutes() {
    const routes = [
        {
            from: "Abuja",
            to: "jos",
            duration: "4 - 5 Hours",
            price: "#8,000",
            departure: "First Bus 7:00 AM"
        },
        {
             from: "Jos",
            to: "Abuja",
            duration: "4 - 5 Hours",
            price: "#8,000",
            departure: "First Bus 7:00 AM"
        },
    ];

    return (
        <section className="popular-routes">
            <h2>Popular Routes</h2>
            <p>Choose from our most freqently traveled routes.</p>

            <div className="routes-container">
                {routes.map((route, index) => (
                    <div className="route-card" key={index}>
                        <h3>
                            {route.form} <span>→</span>
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

                        <button>Book Now</button>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default PopularRoutes;