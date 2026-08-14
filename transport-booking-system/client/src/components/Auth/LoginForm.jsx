import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import "./Auth.css"

function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        remember: false,
    });

    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const redirectPath = location.state?.from;
    const bookingData = location.state?.bookingData;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }))
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();
            console.log("LOGIN RESPONSE:", data)

            if (!response.ok) {
                alert(data.message);
                return;
            }

            // Save user and token in AuthContext
            login(data);

            // Redirect based on user role
            if (data.user.role === "admin") {
                navigate("/admindashboard");
            } else if (redirectPath) {
                navigate(redirectPath, {
                    replace: true,
                    state: bookingData,
                });
            } else {
                navigate("/dashboard");
            }

        } catch (error) {
            console.error(error);
            alert("Unable to connect to the server.");
        }
    };

    return (
        <section className="auth-section">

            <div className="auth-container">

                {/* Left Side */}

                <div className="auth-info">
                    <h1>
                        Welcome Back to BlueWhales
                    </h1>

                    <p>
                        Tavel made simple. enjoy peace and comfort on every journey.
                    </p>
                </div>

                {/* Login Form */}

                <div className="auth-card">
                    <h2>
                        Login
                    </h2>

                    <form onSubmit={handleSubmit}>

                        <div className="input-group">

                            <label>
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">

                            <label>
                                Password
                            </label>

                            <div className="password-box">

                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>
                        <div className="auth-options">

                            <label>

                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={formData.remember}
                                    onChange={handleChange}
                                />

                                Remember me


                            </label>

                            <Link to="/forgot-password">
                                Forgot Password
                            </Link>
                        </div>

                        <button
                            className="auth-button"
                            type="submit"
                        >
                            Login
                        </button>



                        <p className="auth-footer">

                            Don't have an account?

                            <Link to="/register">
                                Register
                            </Link>

                        </p>
                    </form>
                </div>

            </div>
        </section>
    );

}

export default LoginForm;
