import { Navigate, useLocation, useNavigate } from "react-router-dom";
import SeatSelector from "../components/SeatSelector";

function SeatSelection() {

    const location = useLocation();
    const navigate = useNavigate();

    const bookingData = location.state;

    if (!bookingData) {
        return <Navigate to="/" replace />;
    }

    const handleSeat = (seat) => {

        navigate("/booking-summary", {
            state: {
                trip: bookingData.trip,
                passenger: bookingData.passenger,
                seat,
            },
        });

    };

    return (

        <div>

            <SeatSelector
                onSeatSelect={handleSeat}
            />

        </div>

    );

}

export default SeatSelection;