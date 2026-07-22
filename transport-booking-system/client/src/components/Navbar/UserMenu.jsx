import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";


function UserMenu(){

    const { user, logout } = useAuth();

    const navigate = useNavigate();


    const handleLogout = () => {

        logout();

        navigate("/login");

    };


    return (

        <div>

            <span>
                Welcome {user?.fullName}
            </span>


            <button onClick={handleLogout}>
                Logout
            </button>

        </div>

    );
}


export default UserMenu;