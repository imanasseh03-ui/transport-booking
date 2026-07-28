import DashboardLayout from "../components/dashboard/DashboardLayout";

function Dashboard() {
    return (
        <DashboardLayout>
            <div className="welcome-section">
                <h1>Welcome back 👋</h1>
                <p>Here is your travel overview.</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Trips Taken</h3>
                    <strong>12</strong>
                </div>

                <div className="stat-card">
                    <h3>Bookings</h3>
                    <strong>3</strong>
                </div>

                <div className="stat-card">
                    <h3>Routes</h3>
                    <strong>Abuja ↔ Jos</strong>
                </div>
            </div>

            <div className="trip-card">
                <h2>Upcoming Journey</h2>

                <div>
                    <h3>Abuja → Jos</h3>
                    <p>Departure: 7:00 AM</p>
                    <p>Seat: A12</p>

                    <button>View Ticket</button>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default Dashboard;