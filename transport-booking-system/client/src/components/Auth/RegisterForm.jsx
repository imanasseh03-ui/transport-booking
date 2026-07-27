import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

function RegisterForm() {

    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        agree: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
  e.preventDefault();


  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match.");
    return;
  }


  if (!formData.agree) {
    alert("Please accept the Terms & Conditions.");
    return;
  }


  try {

    const response = await fetch(
      "http://localhost:5000/api/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      }
    );


    const data = await response.json();


    if (response.ok) {

      alert("Registration successful. Please login.");

      navigate("/login");

    } else {

      alert(data.message);

    }


  } catch (error) {

    console.error(error);
    alert("Unable to register. Try again.");

  }

};

    return (
        <section className="auth-section">
            <div className="auth-container">

                <div className="auth-info">
                    <h1>Create Your Account</h1>
                    <p>
                        Join BlueWhales and enjoy safe, reliable travel
                        between Abuja and Jos.
                    </p>
                </div>

                <div className="auth-card">
                    <h2>Register</h2>

                    <form onSubmit={handleSubmit}>

                        <div className="input-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                placeholder="Enter your full name"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Email</label>
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
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                placeholder="08012345678"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Password</label>

                            <div className="password-box">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Create password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Confirm Password</label>

                            <input
                                type={showPassword ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Confirm password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="auth-options">
                            <label>
                                <input
                                    type="checkbox"
                                    name="agree"
                                    checked={formData.agree}
                                    onChange={handleChange}
                                />
                                {" "}I agree to the Terms & Conditions
                            </label>
                        </div>

                        <button
                            className="auth-button"
                            type="submit"
                        >
                            Create Account
                        </button>

                        <p className="auth-footer">
                            Already have an account?{" "}
                            <Link to="/login">
                                Login
                            </Link>
                        </p>

                    </form>
                </div>

            </div>
        </section>
    );
}

export default RegisterForm;