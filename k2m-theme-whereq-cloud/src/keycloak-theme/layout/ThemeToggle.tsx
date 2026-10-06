import { useEffect, useState } from "react";

const STORAGE_KEY = "wqc-theme";

/**
 * ThemeToggle — dark/light switch button, per brand design. Dark is the
 * default; the choice persists to localStorage and is applied as
 * `data-theme` on `<html>` (see index.css's [data-theme="light"] block).
 */
export default function ThemeToggle({ lightLabel = "Light", darkLabel = "Dark" }: { lightLabel?: string; darkLabel?: string }) {
    const [theme, setTheme] = useState<"dark" | "light">("dark");

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY) as "dark" | "light" | null;
        const initial = saved ?? "dark";
        setTheme(initial);
        document.documentElement.setAttribute("data-theme", initial);
    }, []);

    const toggle = () => {
        const next = theme === "dark" ? "light" : "dark";
        setTheme(next);
        document.documentElement.setAttribute("data-theme", next);
        try { localStorage.setItem(STORAGE_KEY, next); } catch { /* ignore */ }
    };

    return (
        <button
            type="button"
            onClick={toggle}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            style={{
                height: "30px",
                padding: "0 10px",
                border: "1px solid var(--wqc-border-strong)",
                background: "var(--wqc-surface)",
                color: "var(--wqc-text)",
                borderRadius: "var(--wqc-r-sm)",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                whiteSpace: "nowrap",
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--wqc-accent)")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--wqc-border-strong)")}
        >
            {theme === "dark" ? lightLabel : darkLabel}
        </button>
    );
}
