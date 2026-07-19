import "./Navbar.css";
import { Link } from "react-router-dom"

function Navbar() {
    return (
        <nav className="navbar">
            <div className="logo">
                <h2>BlueWhales</h2>
            </div>

            <ul className="nav-links">
                <li>
          <Link to="/">Home</Link>
        </li>

        <li>
          <Link to="/routes">Routes</Link>
        </li>

        <li>
          <Link to="/book">Book Ticket</Link>
        </li>

        <li>
          <Link to="/contact">Contact</Link>
        </li>
            </ul>

            <button className="login-btn">Login</button>
        </nav>
    );

}

export default Navbar;