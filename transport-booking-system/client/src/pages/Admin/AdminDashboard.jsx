import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
    const navigate = useNavigate();

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(
                    "http://localhost:5000/api/admin/dashboard",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to load dashboard"
                    );
                }

                setStats(data);
            } catch (error) {
                console.error("Admin dashboard error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardStats();
    }, []);

    if (loading) {
        return <h2>Loading admin dashboard...</h2>;
    }

    if (!stats) {
        return <h2>Unable to load admin dashboard.</h2>;
    }

    return (
        <section className="admin-dashboard">

            <div className="admin-dashboard-header">
                <h1>Admin Dashboard</h1>

                <p>
                    Welcome to the BlueWhales management dashboard.
                </p>
            </div>

            {/* Statistics */}

            <div className="admin-stats-grid">

                <div className="admin-stat-card">
                    <h3>Total Bookings</h3>
                    <strong>{stats.totalBookings}</strong>
                </div>

                <div className="admin-stat-card">
                    <h3>Total Trips</h3>
                    <strong>{stats.totalTrips}</strong>
                </div>

                <div className="admin-stat-card">
                    <h3>Total Routes</h3>
                    <strong>{stats.totalRoutes}</strong>
                </div>

                <div className="admin-stat-card">
                    <h3>Total Buses</h3>
                    <strong>{stats.totalBuses}</strong>
                </div>

                <div className="admin-stat-card">
                    <h3>Total Revenue</h3>

                    <strong>
                        ₦{Number(stats.revenue).toLocaleString()}
                    </strong>
                </div>

            </div>

            {/* Quick Actions */}

            <div className="admin-quick-actions">

                <h2>Quick Actions</h2>

                <div className="quick-actions-grid">

                    <button
                        onClick={() => navigate("/admin/bookings")}
                    >
                        View Bookings
                    </button>

                    <button
                        onClick={() => navigate("/admin/users")}
                    >
                        View Users
                    </button>

                    <button
                        onClick={() => navigate("/admin/trips")}
                    >
                        Manage Trips
                    </button>

                    <button
                        onClick={() => navigate("/admin/buses")}
                    >
                        Manage Buses
                    </button>

                </div>

            </div>

            {/* Management Overview */}

            <div className="admin-management">

                <h2>Management</h2>

                <div className="management-grid">

                    <div
                        className="management-card"
                        onClick={() => navigate("/admin/bookings")}
                    >
                        <h3>Bookings</h3>

                        <p>
                            Review, confirm, cancel and complete passenger
                            bookings.
                        </p>
                    </div>

                    <div
                        className="management-card"
                        onClick={() => navigate("/admin/users")}
                    >
                        <h3>Users</h3>

                        <p>
                            View registered BlueWhales customers and their
                            account information.
                        </p>
                    </div>

                    <div
                        className="management-card"
                        onClick={() => navigate("/admin/trips")}
                    >
                        <h3>Trips</h3>

                        <p>
                            Create and manage scheduled trips.
                        </p>
                    </div>

                    <div
                        className="management-card"
                        onClick={() => navigate("/admin/buses")}
                    >
                        <h3>Buses</h3>

                        <p>
                            Manage buses and their available seats.
                        </p>
                    </div>

                </div>

            </div>

        </section>
    );
}

export default AdminDashboard;
