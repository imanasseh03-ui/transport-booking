import "./Hero.css";
import SearchCard from "../SearchCard/SearchCard";
import { useNavigate } from "react-router-dom";

function Hero() {
    const navigate = useNavigate();

    const handleBookNow = () => {
        document
            .querySelector(".search-card")
            ?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
    };

    const handleViewRoutes = () => {
        navigate("/routes");
    };

    return (
        <section className="hero">

            <div className="hero-left">

                <h1>
                    Travel Across Nigeria in Comfort
                </h1>

                <p>
                    Travel Made Simple...
                    <br />
                    Enjoy Peace and Comfort.
                </p>

                <div className="hero-buttons">

                    <button onClick={handleBookNow}>
                        Book Now
                    </button>

                    <button
                        className="secondary-btn"
                        onClick={handleViewRoutes}
                    >
                        View Routes
                    </button>

                </div>

            </div>

            <div className="hero-right">
                <SearchCard />
            </div>

        </section>
    );
}

export default Hero;

