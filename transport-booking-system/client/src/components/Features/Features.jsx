import "./Features.css";
import { FaBus, FaShieldAlt, FaClock, FaMobileAlt } from "react-icons/fa";

function Features() {
  return (
    <section className="features">
      <h2>Why Choose BlueWhales?</h2>

      <div className="features-grid">
        <div className="feature-card">
          <FaBus className="feature-icon" />
          <h3>Comfortable Buses</h3>
          <p>Travel in spacious, air-conditioned buses with reclining seats.</p>
        </div>

        <div className="feature-card">
          <FaShieldAlt className="feature-icon" />
          <h3>Safe & Reliable</h3>
          <p>Professional drivers and well-maintained vehicles.</p>
        </div>

        <div className="feature-card">
          <FaClock className="feature-icon" />
          <h3>On-Time Departure</h3>
          <p>We value your time with dependable schedules.</p>
        </div>

        <div className="feature-card">
          <FaMobileAlt className="feature-icon" />
          <h3>Easy Booking</h3>
          <p>Book your trip online in just a few clicks.</p>
        </div>
      </div>
    </section>
  );
}

export default Features;