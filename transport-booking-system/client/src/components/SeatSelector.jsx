import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/seatSelector.css";


function SeatSelector({ onSeatSelect }) {

    const { tripId } = useParams();

    const [seats, setSeats] = useState([]);
    const [selectedSeat, setSelectedSeat] = useState(null);


    useEffect(() => {

        const fetchSeats = async () => {

            try {

                const response = await fetch(
                    `http://localhost:5000/api/seats/trip/${tripId}`
                );

                const data = await response.json();
                console.log("Seats API Response:", data);

                setSeats(data.seats || []);

            } catch (error) {

                console.log(error);

            }

        };


        fetchSeats();

    }, [tripId]);



    const selectSeat = (seat) => {

        if(seat.status === "Booked") return;


        setSelectedSeat(seat.id);

        onSeatSelect(seat);

    };
    



    return (

        <div className="seat-container">

            <h2>Select Your Seat</h2>


            <div className="bus-layout">

                {seats.map((seat)=>(

                    <button
                        key={seat.id}
                        className={`
                            seat 
                            ${seat.status === "Booked" ? "booked" : ""}
                            ${selectedSeat === seat.id ? "selected" : ""}
                        `}
                        onClick={()=>selectSeat(seat)}
                    >

                        {seat.seat_number}

                    </button>

                ))}


            </div>


        </div>

    );

}


export default SeatSelector;