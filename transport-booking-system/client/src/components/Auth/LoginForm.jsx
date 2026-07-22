import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Auth.css"

function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        remember: false,
    });

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }))
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        login({
            fullName: "Manasseh Ibrahim",
            email: formData.email,
        });

        navigate("/dashboard");
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