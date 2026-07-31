import DashboardLayout from "../components/dashboard/DashboardLayout";
import { useEffect, useState } from "react";

function Dashboard() {

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/api/admin/dashboard"
                );

                const data = await response.json();

                setStats(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    if (loading) {
        return <h2>Loading dashboard...</h2>;
    }

    return (
        <DashboardLayout>
            <div className="welcome-section">
                <h1>Welcome back 👋</h1>
                <p>Here is your travel overview.</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Trips Taken</h3>
                    <strong>{stats.totalTrips}</strong>
                </div>

                <div className="stat-card">
                    <h3>Bookings</h3>
                    <strong>{stats.totalBookings}</strong>
                </div>

                <div className="stat-card">
                    <h3>Routes</h3>
                    <strong>{stats.totalRoutes}</strong>
                </div>
            </div>

            <div className="stat-card">
                <h3>Total Buses</h3>
                <strong>{stats.totalBuses}</strong>
            </div>

            <div className="stat-card">
                <h3>Total Revenue</h3>
                <strong>₦{Number(stats.revenue).toLocaleString()}</strong>
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