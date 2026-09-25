import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./VerifyEmail.css";

function VerifyEmail() {

    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState(
        location.state?.email || ""
    );

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");


    const handleVerify = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");


        if (!email || !otp) {
            setError("Email and verification code are required.");
            return;
        }


        if (otp.length !== 6) {
            setError("Please enter the 6-digit verification code.");
            return;
        }


        try {

            setLoading(true);


            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/auth/verify-email`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        email,
                        otp,
                    }),
                }
            );


            const data = await response.json();


            if (!response.ok) {
                setError(
                    data.message ||
                    "Email verification failed."
                );
                return;
            }


            setMessage(
                "Email verified successfully! Redirecting to login..."
            );


            setTimeout(() => {
                navigate("/login");
            }, 1500);


        } catch (error) {

            console.error(
                "Email verification error:",
                error
            );

            setError(
                "Unable to connect to the server."
            );

        } finally {

            setLoading(false);

        }
    };


    return (
        <div className="verify-email-page">

            <div className="verify-email-card">

                <h2>
                    Verify Your Email
                </h2>


                <p className="verify-email-text">
                    We've sent a 6-digit verification code
                    to your email address.
                </p>


                <form onSubmit={handleVerify}>

                    <div className="form-group">

                        <label>
                            Email Address
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            placeholder="Enter your email"
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Verification Code
                        </label>

                        <input
                            type="text"
                            value={otp}
                            onChange={(e) =>
                                setOtp(
                                    e.target.value
                                        .replace(/\D/g, "")
                                        .slice(0, 6)
                                )
                            }
                            placeholder="Enter 6-digit code"
                            maxLength="6"
                            inputMode="numeric"
                            required
                        />

                    </div>


                    {error && (
                        <p className="verify-error">
                            {error}
                        </p>
                    )}


                    {message && (
                        <p className="verify-success">
                            {message}
                        </p>
                    )}


                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Verifying..."
                            : "Verify Email"}
                    </button>

                </form>


                <p className="verify-login">

                    Already verified?

                    {" "}

                    <span
                        onClick={() =>
                            navigate("/login")
                        }
                    >
                        Login
                    </span>

                </p>

            </div>

        </div>
    );
}

export default VerifyEmail;
