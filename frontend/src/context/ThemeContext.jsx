/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";

// ─── Theme Palettes ──────────────────────────────────────────
const THEMES = {
    light: {
        name: "Light",
        emoji: "☀️",
        isDark: false,
        bg: "#f5f5f0",
        cardBg: "#fff",
        inputBg: "#fff",
        inputBorder: "#e0e0e0",
        inputFocusBorder: "#111",
        textPrimary: "#111",
        textSecondary: "#555",
        textMuted: "#888",
        btnBg: "#111",
        btnText: "#fff",
        accent: "#22c55e",
        navBg: "rgba(255,255,255,0.95)",
        navBorder: "rgba(0,0,0,0.06)",
        navShadow: "0 2px 20px rgba(0,0,0,0.06)",
        divider: "#eee",
        hoverBg: "#f5f5f5",
    },
    dark: {
        name: "Dark",
        emoji: "🌙",
        isDark: true,
        bg: "#0a0a0a",
        cardBg: "#151515",
        inputBg: "#1a1a1a",
        inputBorder: "#333",
        inputFocusBorder: "#666",
        textPrimary: "#fff",
        textSecondary: "#ccc",
        textMuted: "#777",
        btnBg: "#fff",
        btnText: "#111",
        accent: "#22c55e",
        navBg: "rgba(30,30,30,0.92)",
        navBorder: "rgba(255,255,255,0.08)",
        navShadow: "0 2px 20px rgba(0,0,0,0.3)",
        divider: "#333",
        hoverBg: "#252525",
    },
    ocean: {
        name: "Ocean",
        emoji: "🌊",
        isDark: true,
        bg: "#0f172a",
        cardBg: "#1e293b",
        inputBg: "#1e293b",
        inputBorder: "#334155",
        inputFocusBorder: "#38bdf8",
        textPrimary: "#f1f5f9",
        textSecondary: "#94a3b8",
        textMuted: "#64748b",
        btnBg: "#38bdf8",
        btnText: "#0f172a",
        accent: "#38bdf8",
        navBg: "rgba(15,23,42,0.95)",
        navBorder: "rgba(56,189,248,0.12)",
        navShadow: "0 2px 20px rgba(0,0,0,0.3)",
        divider: "#334155",
        hoverBg: "#283548",
    },
    forest: {
        name: "Forest",
        emoji: "🌲",
        isDark: true,
        bg: "#0a1a0a",
        cardBg: "#132913",
        inputBg: "#132913",
        inputBorder: "#1e3a1e",
        inputFocusBorder: "#4ade80",
        textPrimary: "#e8f5e8",
        textSecondary: "#a3c9a3",
        textMuted: "#6b9b6b",
        btnBg: "#4ade80",
        btnText: "#0a1a0a",
        accent: "#4ade80",
        navBg: "rgba(10,26,10,0.95)",
        navBorder: "rgba(74,222,128,0.12)",
        navShadow: "0 2px 20px rgba(0,0,0,0.3)",
        divider: "#1e3a1e",
        hoverBg: "#1a351a",
    },
    sunset: {
        name: "Sunset",
        emoji: "🌅",
        isDark: true,
        bg: "#1a0a1e",
        cardBg: "#2d1233",
        inputBg: "#2d1233",
        inputBorder: "#4a1d52",
        inputFocusBorder: "#f472b6",
        textPrimary: "#fce7f3",
        textSecondary: "#d4a0c0",
        textMuted: "#9b6b8a",
        btnBg: "#f472b6",
        btnText: "#1a0a1e",
        accent: "#f472b6",
        navBg: "rgba(26,10,30,0.95)",
        navBorder: "rgba(244,114,182,0.12)",
        navShadow: "0 2px 20px rgba(0,0,0,0.3)",
        divider: "#4a1d52",
        hoverBg: "#3a1740",
    },
};

const THEME_KEYS = Object.keys(THEMES);

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [themeKey, setThemeKey] = useState(() => {
        return localStorage.getItem("theme") || "light";
    });

    const theme = THEMES[themeKey] || THEMES.light;
    const isDark = theme.isDark;

    useEffect(() => {
        localStorage.setItem("theme", themeKey);
    }, [themeKey]);

    // Legacy toggle — cycles between light and dark
    const toggle = () => setThemeKey((prev) => (prev === "light" ? "dark" : "light"));

    // Set a specific theme
    const setTheme = (key) => {
        if (THEMES[key]) setThemeKey(key);
    };

    return (
        <ThemeContext.Provider value={{ theme, isDark, toggle, setTheme, themeKey, themeKeys: THEME_KEYS, themes: THEMES }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
