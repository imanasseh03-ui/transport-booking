import { useEffect, useState } from "react";
import {
  FaArrowRight,
  FaBus,
  FaCalendarCheck,
  FaMapMarkedAlt,
  FaRoute,
  FaTicketAlt,
  FaUserCircle,
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
          `${import.meta.env.VITE_API_URL}/bookings/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load dashboard");
        }

        setStats(data);
      } catch (err) {
        setError(err.message);
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
          <p>Preparing your travel overview.</p>
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
    upcomingJourney: null,
    recentBookings: [],
  };

  const upcomingJourney = dashboardStats.upcomingJourney;
  const recentBookings = dashboardStats.recentBookings;

  const formattedDeparture = upcomingJourney
    ? new Date(upcomingJourney.departure_date).toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const statCards = [
    {
      label: "Bookings",
      value: dashboardStats.totalBookings,
      note: "Reservations made",
      icon: <FaTicketAlt />,
    },
    {
      label: "Completed Trips",
      value: dashboardStats.totalTrips,
      note: "Journeys completed",
      icon: <FaCalendarCheck />,
    },
    {
      label: "Upcoming",
      value: upcomingJourney ? 1 : 0,
      note: "Confirmed trip",
      icon: <FaBus />,
    },
  ];

  return (
    <DashboardLayout>
      {/* Hero */}
      <section className="dashboard-hero">
        <div>
          <span className="dashboard-eyebrow">
            BlueWhales Passenger Portal
          </span>

          <h1>Welcome back 👋</h1>

          <p>
            Manage your bookings, track your journeys and book your next trip.
          </p>
        </div>

        <Link to="/book-trip" className="primary-action compact-action">
          Book New Trip
        </Link>
      </section>

      {/* Stats */}
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

      {/* Upcoming Journey + Quick Actions */}
      <section className="dashboard-grid">
        <article className="trip-card">
          <div className="section-heading">
            <div>
              <span>Next Trip</span>
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

              <Link to="/bookings" className="primary-action">
                View Ticket
              </Link>
            </div>
          ) : (
            <div className="empty-journey">
              <FaMapMarkedAlt />

              <h3>No upcoming journey</h3>

              <p>
                Your next confirmed trip will appear here after making a booking.
              </p>

              <Link to="/book-trip" className="primary-action">
                Book a Trip
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

          <Link to="/book-trip">
            <FaRoute />
            <span>Book a Trip</span>
            <FaArrowRight />
          </Link>

          <Link to="/bookings">
            <FaTicketAlt />
            <span>My Bookings</span>
            <FaArrowRight />
          </Link>

          <Link to="/profile">
            <FaUserCircle />
            <span>My Profile</span>
            <FaArrowRight />
          </Link>
        </aside>
      </section>

      {/* Booking History */}
      <section className="booking-history">
        <div className="section-heading">
          <div>
            <span>History</span>
            <h2>Recent Bookings</h2>
          </div>
        </div>

        {recentBookings.length === 0 ? (
          <div className="empty-bookings">
            <p>You haven't made any bookings yet.</p>
          </div>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Route</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {recentBookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.booking_reference}</td>

                  <td>
                    {booking.origin} → {booking.destination}
                  </td>

                  <td>{booking.departure_date}</td>

                  <td>
                    <span
                      className={`status-badge ${booking.booking_status.toLowerCase()}`}
                    >
                      {booking.booking_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </DashboardLayout>
  );
}

export default Dashboard;
