import { useEffect, useState } from "react";
import {
    FaArrowRight,
    FaBus,
    FaCalendarCheck,
    FaMapMarkedAlt,
    FaMoneyBillWave,
    FaRoute,
    FaTicketAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/dashboard/DashboardLayout";

function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(
                    "http://localhost:5000/api/bookings/dashboard",
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
                console.error("Dashboard error:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <DashboardLayout>
                <div className="dashboard-state">
                    <h1>Loading dashboard...</h1>
                    <p>Preparing your latest travel overview.</p>
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <div className="dashboard-state dashboard-state-error">
                    <h1>Unable to load dashboard</h1>
                    <p>{error}</p>
                </div>
            </DashboardLayout>
        );
    }

    const dashboardStats = stats || {
        totalTrips: 0,
        totalBookings: 0,
        totalRoutes: 0,
        totalBuses: 0,
        revenue: 0,
        upcomingJourney: null,
    };

    const upcomingJourney = dashboardStats.upcomingJourney;
    const totalSpend = Number(dashboardStats.revenue).toLocaleString();
    const formattedDeparture = upcomingJourney
        ? new Date(upcomingJourney.departure_date).toLocaleDateString(
            undefined,
            {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
            }
        )
        : "";

    const statCards = [
        {
            label: "Trips Taken",
            value: dashboardStats.totalTrips,
            note: "Confirmed or completed journeys",
            icon: <FaCalendarCheck />,
        },
        {
            label: "Bookings",
            value: dashboardStats.totalBookings,
            note: "All reservations on your account",
            icon: <FaTicketAlt />,
        },
        {
            label: "Routes",
            value: dashboardStats.totalRoutes,
            note: "Different routes travelled",
            icon: <FaRoute />,
        },
        {
            label: "Buses",
            value: dashboardStats.totalBuses,
            note: "Vehicles used for your trips",
            icon: <FaBus />,
        },
    ];

    return (
        <DashboardLayout>
            <section className="dashboard-hero">
                <div>
                    <span className="dashboard-eyebrow">Customer dashboard</span>
                    <h1>Welcome back</h1>
                    <p>
                        Track your bookings, upcoming travel plans, and spend
                        from one clean workspace.
                    </p>
                </div>

                <div className="dashboard-hero-total">
                    <span>Total Spend</span>
                    <strong>NGN {totalSpend}</strong>
                </div>
            </section>

            <section className="stats-grid">
                {statCards.map((card) => (
                    <article className="stat-card" key={card.label}>
                        <div className="stat-icon">{card.icon}</div>
                        <div>
                            <h3>{card.label}</h3>
                            <strong>{card.value}</strong>
                            <p>{card.note}</p>
                        </div>
                    </article>
                ))}
            </section>

            <section className="dashboard-grid">
                <article className="trip-card">
                    <div className="section-heading">
                        <div>
                            <span>Next trip</span>
                            <h2>Upcoming Journey</h2>
                        </div>
                    </div>

                    {upcomingJourney ? (
                        <div className="journey-panel">
                            <div className="route-line">
                                <div>
                                    <span>From</span>
                                    <strong>{upcomingJourney.origin}</strong>
                                </div>
                                <FaArrowRight />
                                <div>
                                    <span>To</span>
                                    <strong>{upcomingJourney.destination}</strong>
                                </div>
                            </div>

                            <div className="journey-details">
                                <p>
                                    <span>Date</span>
                                    {formattedDeparture}
                                </p>
                                <p>
                                    <span>Time</span>
                                    {upcomingJourney.departure_time}
                                </p>
                                <p>
                                    <span>Seat</span>
                                    {upcomingJourney.seat_number}
                                </p>
                                <p>
                                    <span>Reference</span>
                                    {upcomingJourney.booking_reference}
                                </p>
                            </div>

                            <button className="primary-action">
                                View Ticket
                            </button>
                        </div>
                    ) : (
                        <div className="empty-journey">
                            <FaMapMarkedAlt />
                            <h3>No upcoming journey</h3>
                            <p>
                                Your next confirmed trip will appear here after
                                you make a booking.
                            </p>
                            <Link to="/routes" className="primary-action">
                                Find a route
                            </Link>
                        </div>
                    )}
                </article>

                <aside className="quick-actions">
                    <div className="section-heading">
                        <div>
                            <span>Shortcuts</span>
                            <h2>Quick Actions</h2>
                        </div>
                    </div>

                    <Link to="/routes">
                        <FaRoute />
                        <span>Browse routes</span>
                        <FaArrowRight />
                    </Link>

                    <Link to="/book">
                        <FaBus />
                        <span>Book a trip</span>
                        <FaArrowRight />
                    </Link>

                    <Link to="/dashboard">
                        <FaMoneyBillWave />
                        <span>Review spend</span>
                        <FaArrowRight />
                    </Link>
                </aside>
            </section>
        </DashboardLayout>
    );
}

export default Dashboard;
