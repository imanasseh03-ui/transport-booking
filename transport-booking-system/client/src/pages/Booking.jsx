import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Booking.css";

function Booking() {
    const location = useLocation();
      const navigate = useNavigate();
      
    const selectedRoute = location.state?.route;

    const [passenger, setPassenger] = useState({
        fullName: "",
        phone: "",
        email: "",
        passengers: 1,
    });

    if (!selectedRoute) {
        return <Navigate to="/search-results" replace />;
    }

    const handleChange = (e) => {
        setPassenger({
            ...passenger,
            [e.target.name]: e.target.value,
        });
    };

    

    const handleSubmit = (e) => {
        e.preventDefault();

        navigate("/booking-summary", {
            state: {
                route: selectedRoute,
                passenger,
            },
        });

        // Next step:
        // Navigate to Booking Summary
    };


    return (
        <section className="booking-page">

            <h1>Passenger Details</h1>

            <div className="booking-card">

                <h2>
                    {selectedRoute.from} → {selectedRoute.to}
                </h2>

                <p>Departure: {selectedRoute.departure}</p>

                <p>Bus: {selectedRoute.bus}</p>

                <p>Price: ₦{selectedRoute.price.toLocaleString()}</p>

                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        value={passenger.fullName}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={passenger.phone}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={passenger.email}
                        onChange={handleChange}
                        required
                    />

                    <button type="submit">
                        Continue
                    </button>

                </form>

            </div>

        </section>
    );
}

export default Booking;