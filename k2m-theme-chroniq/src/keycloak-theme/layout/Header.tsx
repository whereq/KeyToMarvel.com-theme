import { useEffect, useState } from "react";
import { ChroniqWordmark } from "@keycloak-theme/shared/ui";
import type { KcContext } from "./KcContext";
import type { I18n } from "./i18n";
import type { KcClsx } from "keycloakify/login/lib/kcClsx";

interface HeaderProps {
    kcContext: KcContext;
    i18n: I18n;
    kcClsx: KcClsx;
}

/** Supported locale display labels. */
const LOCALE_LABELS: Record<string, string> = {
    "en":    "EN",
    "zh-CN": "中文",
    "zh-TW": "中文",
    "ja":    "JA",
    "de":    "DE",
    "es":    "ES",
    "it":    "IT",
    "fr":    "FR",
};

function GlobeIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
    );
}

function ChevronIcon() {
    return (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="6 9 12 15 18 9" />
        </svg>
    );
}

function SunIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
    );
}

function MoonIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
    );
}

/**
 * Header — Chroniq Metro top navigation bar.
 *
 * Shows ChroniqWordmark on the left.
 * On the right: language dropdown + theme toggle (sun/moon).
 * Theme persisted to localStorage `cqTheme`, applied as `data-theme` on `<html>`.
 */
export default function Header({ kcContext: _kcContext, i18n }: HeaderProps) {
    const { currentLanguage, enabledLanguages } = i18n;
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [theme, setTheme] = useState<"dark" | "light">("dark");

    // Init theme from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("cqTheme") as "dark" | "light" | null;
        const initial = saved ?? "dark";
        setTheme(initial);
        document.documentElement.setAttribute("data-theme", initial);
    }, []);

    const toggleTheme = () => {
        const next = theme === "dark" ? "light" : "dark";
        setTheme(next);
        document.documentElement.setAttribute("data-theme", next);
        try { localStorage.setItem("cqTheme", next); } catch { /* ignore */ }
    };

    // Build locale list from Keycloakify's enabledLanguages
    const locales = enabledLanguages ?? [];
    const currentTag = currentLanguage.languageTag;
    const currentLabel = LOCALE_LABELS[currentTag] ?? currentTag.toUpperCase().slice(0, 2);

    return (
        <header
            id="cq-header"
            className="fixed top-0 left-0 right-0 z-[var(--cq-z-overlay)]"
            style={{
                height: "52px",
                background: "var(--cq-surface)",
                borderBottom: "1px solid var(--cq-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 24px",
            }}
        >
            {/* Brand */}
            <ChroniqWordmark size={28} />

            {/* Right controls */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {/* Locale dropdown */}
                {locales.length > 1 && (
                    <div style={{ position: "relative" }}>
                        <button
                            type="button"
                            onClick={() => setDropdownOpen(o => !o)}
                            aria-haspopup="listbox"
                            aria-expanded={dropdownOpen}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                                padding: "5px 8px",
                                background: "transparent",
                                border: "1px solid var(--cq-border)",
                                borderRadius: "var(--cq-r-sm)",
                                color: "var(--cq-text-2)",
                                fontSize: "0.7rem",
                                fontFamily: "var(--cq-font-mono)",
                                fontWeight: 600,
                                cursor: "pointer",
                                letterSpacing: "0.05em",
                                transition: "border-color var(--cq-transition-fast)",
                            }}
                            onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--cq-border-strong)")}
                            onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--cq-border)")}
                        >
                            <GlobeIcon />
                            <span>{currentLabel}</span>
                            <ChevronIcon />
                        </button>

                        {dropdownOpen && (
                            <>
                                {/* Backdrop */}
                                <div
                                    style={{ position: "fixed", inset: 0, zIndex: 10 }}
                                    onClick={() => setDropdownOpen(false)}
                                />
                                <ul
                                    role="listbox"
                                    style={{
                                        position: "absolute",
                                        top: "calc(100% + 4px)",
                                        right: 0,
                                        zIndex: 11,
                                        background: "var(--cq-surface)",
                                        border: "1px solid var(--cq-border)",
                                        borderRadius: "var(--cq-r-sm)",
                                        minWidth: "110px",
                                        listStyle: "none",
                                        margin: 0,
                                        padding: "4px 0",
                                        boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                                    }}
                                >
                                    {locales.map(lang => {
                                        const isCurrent = lang.languageTag === currentTag;
                                        const label = LOCALE_LABELS[lang.languageTag] ?? lang.label;
                                        return (
                                            <li key={lang.languageTag} role="option" aria-selected={isCurrent}>
                                                {isCurrent ? (
                                                    <span
                                                        style={{
                                                            display: "block",
                                                            padding: "7px 12px",
                                                            fontSize: "0.75rem",
                                                            fontFamily: "var(--cq-font-mono)",
                                                            color: "var(--cq-accent)",
                                                            fontWeight: 700,
                                                        }}
                                                    >
                                                        {label}
                                                    </span>
                                                ) : (
                                                    <a
                                                        href={lang.href}
                                                        lang={lang.languageTag}
                                                        style={{
                                                            display: "block",
                                                            padding: "7px 12px",
                                                            fontSize: "0.75rem",
                                                            fontFamily: "var(--cq-font-mono)",
                                                            color: "var(--cq-text-2)",
                                                            textDecoration: "none",
                                                            transition: "background var(--cq-transition-fast), color var(--cq-transition-fast)",
                                                        }}
                                                        onMouseEnter={e => {
                                                            (e.currentTarget as HTMLAnchorElement).style.background = "var(--cq-surface-2)";
                                                            (e.currentTarget as HTMLAnchorElement).style.color = "var(--cq-text)";
                                                        }}
                                                        onMouseLeave={e => {
                                                            (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                                                            (e.currentTarget as HTMLAnchorElement).style.color = "var(--cq-text-2)";
                                                        }}
                                                    >
                                                        {label}
                                                    </a>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </>
                        )}
                    </div>
                )}

                {/* Theme toggle */}
                <button
                    type="button"
                    onClick={toggleTheme}
                    aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "30px",
                        height: "30px",
                        background: "transparent",
                        border: "1px solid var(--cq-border)",
                        borderRadius: "var(--cq-r-sm)",
                        color: "var(--cq-muted)",
                        cursor: "pointer",
                        transition: "border-color var(--cq-transition-fast), color var(--cq-transition-fast)",
                    }}
                    onMouseEnter={e => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--cq-border-strong)";
                        (e.currentTarget as HTMLButtonElement).style.color = "var(--cq-text)";
                    }}
                    onMouseLeave={e => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--cq-border)";
                        (e.currentTarget as HTMLButtonElement).style.color = "var(--cq-muted)";
                    }}
                >
                    {theme === "dark" ? <SunIcon /> : <MoonIcon />}
                </button>
            </div>
        </header>
    );
}
