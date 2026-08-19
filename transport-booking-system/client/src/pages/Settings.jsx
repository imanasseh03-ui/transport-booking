import { useState } from "react";
import { FaSave } from "react-icons/fa";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import {
    applyThemePreference,
    getStoredThemeSettings,
    saveThemeSettings,
} from "../utils/theme";

function Settings() {
    const [settings, setSettings] = useState(getStoredThemeSettings);
    const [saved, setSaved] = useState(false);

    const handleToggle = (event) => {
        setSaved(false);
        setSettings({
            ...settings,
            [event.target.name]: event.target.checked,
        });
    };

    const handleThemeChange = (event) => {
        const nextSettings = {
            ...settings,
            theme: event.target.value,
        };

        setSaved(false);
        setSettings(nextSettings);
        saveThemeSettings(nextSettings);
        applyThemePreference(nextSettings.theme);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        saveThemeSettings(settings);
        applyThemePreference(settings.theme);
        setSaved(true);
    };

    return (
        <DashboardLayout>
            <section className="dashboard-page-header">
                <div>
                    <span className="dashboard-eyebrow">Preferences</span>
                    <h1>Settings</h1>
                    <p>Control notifications and dashboard preferences.</p>
                </div>
            </section>

            <section className="dashboard-panel">
                <form className="settings-list" onSubmit={handleSubmit}>
                    <label className="setting-row">
                        <div>
                            <h2>Email Updates</h2>
                            <p>Receive booking receipts and travel updates.</p>
                        </div>
                        <input
                            type="checkbox"
                            name="emailUpdates"
                            checked={settings.emailUpdates}
                            onChange={handleToggle}
                        />
                    </label>

                    <label className="setting-row">
                        <div>
                            <h2>SMS Alerts</h2>
                            <p>Get departure reminders on your phone.</p>
                        </div>
                        <input
                            type="checkbox"
                            name="smsAlerts"
                            checked={settings.smsAlerts}
                            onChange={handleToggle}
                        />
                    </label>

                    <label className="setting-row">
                        <div>
                            <h2>Trip Reminders</h2>
                            <p>Show upcoming journey reminders in the dashboard.</p>
                        </div>
                        <input
                            type="checkbox"
                            name="tripReminders"
                            checked={settings.tripReminders}
                            onChange={handleToggle}
                        />
                    </label>

                    <label className="setting-row theme-row">
                        <div>
                            <h2>Theme</h2>
                            <p>Choose how the whole app should appear.</p>
                        </div>
                        <select value={settings.theme} onChange={handleThemeChange}>
                            <option value="system">System</option>
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                        </select>
                    </label>

                    <button type="submit" className="primary-action form-action">
                        <FaSave />
                        Save Settings
                    </button>

                    {saved && <p className="success-note">Settings saved.</p>}
                </form>
            </section>
        </DashboardLayout>
    );
}

export default Settings;
