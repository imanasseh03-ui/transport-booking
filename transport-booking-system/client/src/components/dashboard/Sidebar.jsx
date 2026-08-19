import {
    FaHome,
    FaBus,
    FaTicketAlt,
    FaUser,
    FaCog,
    FaSignOutAlt,
} from "react-icons/fa";

import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import logo from "../../assets/images/logo.png";

function Sidebar() {
    const { logout } = useAuth();

    return (
        <aside className="sidebar">
            <div className="logo">
                <img
                    src={logo}
                    alt="BlueWhales Logo"
                    className="dashboard-logo-image"
                />
                <p>Travel Made Simple</p>
            </div>

            <nav>
                <NavLink to="/dashboard">
                    <FaHome />
                    <span>Dashboard</span>
                </NavLink>

                <NavLink to="/bookings">
                    <FaTicketAlt />
                    <span>My Bookings</span>
                </NavLink>

                <NavLink to="/book-trip">
                    <FaBus />
                    <span>Book Trip</span>
                </NavLink>

                <NavLink to="/profile">
                    <FaUser />
                    <span>Profile</span>
                </NavLink>

                <NavLink to="/settings">
                    <FaCog />
                    <span>Settings</span>
                </NavLink>
            </nav>

            <button className="logout-btn" onClick={logout}>
                <FaSignOutAlt />
                Logout
            </button>
        </aside>
    );
}

export default Sidebar;
