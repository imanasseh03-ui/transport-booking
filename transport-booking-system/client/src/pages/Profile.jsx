import { useState } from "react";
import { FaSave, FaUserCircle } from "react-icons/fa";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { useAuth } from "../context/useAuth";

function Profile() {
    const { user, updateUser } = useAuth();
    const [saved, setSaved] = useState(false);
    const [form, setForm] = useState({
        full_name: user?.full_name || "",
        email: user?.email || "",
        phone: user?.phone || "",
    });

    const handleChange = (event) => {
        setSaved(false);
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        updateUser({ ...user, ...form });
        setSaved(true);
    };

    return (
        <DashboardLayout>
            <section className="dashboard-page-header">
                <div>
                    <span className="dashboard-eyebrow">Account</span>
                    <h1>Profile</h1>
                    <p>Keep your passenger details ready for future bookings.</p>
                </div>
            </section>

            <section className="dashboard-panel profile-panel">
                <div className="profile-avatar">
                    <FaUserCircle />
                    <div>
                        <h2>{form.full_name || "Customer"}</h2>
                        <p>{user?.role || "User"}</p>
                    </div>
                </div>

                <form className="dashboard-form stacked-form" onSubmit={handleSubmit}>
                    <label>
                        Full Name
                        <input
                            name="full_name"
                            value={form.full_name}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label>
                        Email Address
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label>
                        Phone Number
                        <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                        />
                    </label>

                    <button type="submit" className="primary-action form-action">
                        <FaSave />
                        Save Profile
                    </button>

                    {saved && <p className="success-note">Profile saved.</p>}
                </form>
            </section>
        </DashboardLayout>
    );
}

export default Profile;
