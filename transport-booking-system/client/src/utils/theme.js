export const THEME_STORAGE_KEY = "dashboardSettings";

export const defaultThemeSettings = {
    emailUpdates: true,
    smsAlerts: true,
    tripReminders: true,
    theme: "system",
};

export function getStoredThemeSettings() {
    const storedSettings = localStorage.getItem(THEME_STORAGE_KEY);

    if (!storedSettings) {
        return defaultThemeSettings;
    }

    try {
        return {
            ...defaultThemeSettings,
            ...JSON.parse(storedSettings),
        };
    } catch {
        localStorage.removeItem(THEME_STORAGE_KEY);
        return defaultThemeSettings;
    }
}

export function saveThemeSettings(settings) {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(settings));
}

export function applyThemePreference(themePreference) {
    const root = document.documentElement;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const resolvedTheme =
        themePreference === "system"
            ? prefersDark
                ? "dark"
                : "light"
            : themePreference;

    root.dataset.theme = resolvedTheme;
    root.style.colorScheme = resolvedTheme;
}

export function applyStoredTheme() {
    applyThemePreference(getStoredThemeSettings().theme);
}
