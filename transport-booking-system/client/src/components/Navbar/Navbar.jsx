import "./Navbar.css";

function Navbar() {
    return (
        <nav className="navbar">
            <div className="logo">
                <h2>BlueWhales</h2>
            </div>

            <ul className="nav-links">
                <li><a href="#">Home</a></li>
                 <li><a href="#">Routes</a></li>
                 <li><a href="#">Book Ticket</a></li>
                 <li><a href="#">Contact</a></li>
            </ul>

            <button className="login-btn">Login</button>
        </nav>
    );

}

export default Navbar;