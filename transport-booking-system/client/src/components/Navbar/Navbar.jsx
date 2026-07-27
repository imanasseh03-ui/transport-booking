import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "../../context/useAuth.jsx";


function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const closeMenu = () => setMenuOpen(false);


  const handleLogout = () => {
    logout();
    navigate("/");
  };


  return (
    <nav className="navbar">

      <div className="logo">
        <h2>BlueWhales</h2>
      </div>


      <div
        className="menu-icon"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>


      <ul className={menuOpen ? "nav-links active" : "nav-links"}>

        <li>
          <Link to="/" onClick={closeMenu}>
            Home
          </Link>
        </li>


        <li>
          <Link to="/routes" onClick={closeMenu}>
            Routes
          </Link>
        </li>


        <li>
          <Link to="/book" onClick={closeMenu}>
            Book Ticket
          </Link>
        </li>


        <li>
          <Link to="/contact" onClick={closeMenu}>
            Contact
          </Link>
        </li>

      </ul>


      <div className="auth-buttons">

        {user ? (
          <>
            <span className="welcome">
              Hi, {user.full_name}
            </span>

            <button 
              className="login-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              <button className="login-btn">
                Login
              </button>
            </Link>

            <Link to="/register">
              <button className="register-btn">
                Register
              </button>
            </Link>
          </>
        )}

      </div>

    </nav>
  );
}

export default Navbar;