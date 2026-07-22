import { useAuth } from "../context/AuthContext";

function Dashboard() {
    const { user } = useAuth();

    return (
        <div style={{ padding: "40px" }}>
            <h1>
                Welcome {user?.fullName || "Customer"} 👋
            </h1>

            <h3>Your next trip</h3>

            <div
                style={{
                    background: "#fff",
                    padding: "20px",
                    borderRadius: "10px",
                    marginTop: "20px",
                    boxShadow: "0 5px 15px rgba(0,0,0,.1)",
                }}
            >
                <p>Abuja → Jos</p>
                <p>Departure: 7:00 AM</p>
                <p>Seat: A12</p>
            </div>
        </div>
    );
}

export default Dashboard;