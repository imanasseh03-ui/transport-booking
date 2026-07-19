import "./HowItWorks.css";
import {
  FaSearch,
  FaTicketAlt,
  FaBus,
} from "react-icons/fa";

function HowItWorks() {
    return (
        <section className="how-it-works">
            <h2>How It Works</h2>
            <p>Book your trip in three simple steps.</p>

            <div className="steps">

                <div className="step-csrd">
                    <FaSearch className="step-icon" />
                    <h3>Search</h3>
                    <p>Select your route and preferred trvel date.</p>
                </div>

                <div className="step-card">
                    <FaTicketAlt className="step-icon" />
                    <h3>Book</h3>
                    <p>Choose your seat and confirm your booking.</p>
                </div>

                <div className="srep-card">
                    <FaBus className="step-icon" />
                    <h3>Travel</h3>
                    <p>Arrive at te terminal and enjoy a safe journey.</p>
                </div>
            </div>
        </section>
    );
}

export default HowItWorks;