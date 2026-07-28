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

function Sidebar() {
    const { logout } = useAuth();

    return (
        <aside className="sidebar">
            <div className="logo">
                <h2>BlueWhales</h2>
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

                <NavLink to="/booking">
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