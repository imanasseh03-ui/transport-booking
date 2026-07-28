import { FaBell } from "react-icons/fa";
import { useAuth } from "../../context/useAuth";

function Topbar() {
    const { user } = useAuth();

    return (
        <header className="topbar">

            <div>
                <h2>
                    Dashboard
                </h2>

                <p>
                    Manage your trips and bookings
                </p>
            </div>


            <div className="topbar-right">

                <button className="notification">
                    <FaBell />
                </button>


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