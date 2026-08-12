import "./RouteBooking.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

function RouteBooking() {

    const location = useLocation();
    const navigate = useNavigate();

    const selectedRoute = location.state?.route;

    const [date, setDate] = useState("");
    const [passengers, setPassengers] = useState("1");


    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];


    const handleSubmit = (e) => {

        e.preventDefault();

        if (!date) {
            alert("Please select your travel date.");
            return;
        }


        navigate("/search-results", {
            state: {
                from: selectedRoute?.from || "",
                to: selectedRoute?.to || "",
                date,
                passengers,
            },
        });

    };


    return (
        <section className="route-booking">

            <div className="route-booking-container">

                <div className="route-booking-header">

                    <h1>
                        Book Your Trip
                    </h1>

                    <p>
                        Choose your travel date and number of passengers.
                    </p>

                </div>


                {selectedRoute && (

                    <div className="selected-route">

                        <h2>
                            {selectedRoute.from}
                            <span> → </span>
                            {selectedRoute.to}
                        </h2>

                        <p>
                            Duration: {selectedRoute.duration}
                        </p>

                        <p>
                            Fare: ₦
                            {selectedRoute.price.toLocaleString()}
                        </p>

                    </div>

                )}


                <form
                    className="route-booking-form"
                    onSubmit={handleSubmit}
                >

                    <div className="form-group">

                        <label>
                            Departure
                        </label>

                        <input
                            type="text"
                            value={selectedRoute?.from || ""}
                            readOnly
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Destination
                        </label>

                        <input
                            type="text"
                            value={selectedRoute?.to || ""}
                            readOnly
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Travel Date
                        </label>

                        <input
                            type="date"
                            min={today}
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Passengers
                        </label>

                        <select
                            value={passengers}
                            onChange={(e) =>
                                setPassengers(e.target.value)
                            }
                        >

                            <option value="1">
                                1 Passenger
                            </option>

                            <option value="2">
                                2 Passengers
                            </option>

                            <option value="3">
                                3 Passengers
                            </option>

                            <option value="4">
                                4 Passengers
                            </option>

                        </select>

                    </div>


                    <button type="submit">
                        Search Available Trips
                    </button>

                </form>

            </div>

        </section>
    );
}

export default RouteBooking;

