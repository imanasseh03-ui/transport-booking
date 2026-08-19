import { FaBell } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

function Topbar() {
    const { user } = useAuth();
    const location = useLocation();

    const pageTitles = {
        "/dashboard": "Dashboard",
        "/bookings": "My Bookings",
        "/dashboard/bookings": "My Bookings",
        "/book-trip": "Book Trip",
        "/booking": "Book Trip",
        "/profile": "Profile",
        "/settings": "Settings",
    };

    const title = pageTitles[location.pathname] || "Dashboard";

    return (
        <header className="topbar">

            <div>
                <h2>
                    {title}
                </h2>

                <p>
                    Manage your trips and bookings
                </p>
            </div>


            <div className="topbar-right">

                <Link
                    to="/bookings"
                    className="notification"
                    aria-label="View booking notifications"
                    title="View booking notifications"
                >
                    <FaBell />
                </Link>


                <div className="user-info">

                    <div className="avatar">
                        {
                            user?.full_name
                            ?.charAt(0)
                            ||
                            "U"
                        }
                    </div>

                    <div>
                        <h4>
                            {
                                user?.full_name ||
                                "Customer"
                            }
                        </h4>

                        <small>
                            {
                                user?.role ||
                                "User"
                            }
                        </small>
                    </div>

                </div>

            </div>

        </header>
    );
}

export default Topbar;
