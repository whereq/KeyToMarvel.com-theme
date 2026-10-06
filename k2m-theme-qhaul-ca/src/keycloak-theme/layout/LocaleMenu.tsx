import { useState } from "react";
import type { I18n } from "./i18n";

/** Supported locale short labels, matching the QHaul brand design mock. */
const LOCALE_LABELS: Record<string, string> = {
    "en": "EN",
    "zh-CN": "中文",
    "fr": "FR",
};

function GlobeIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--qh-text)" strokeWidth="1.8" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18" />
            <path d="M12 3c2.6 2.4 4 5.5 4 9s-1.4 6.6-4 9c-2.6-2.4-4-5.5-4-9s1.4-6.6 4-9z" />
        </svg>
    );
}

function ChevronIcon() {
    return (
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="var(--qh-muted-2)" strokeWidth="2" aria-hidden="true">
            <path d="M2 4l4 4 4-4" />
        </svg>
    );
}

/**
 * LocaleMenu — globe + current locale + chevron trigger, opening a dropdown of
 * available locales. Styling matches the QHaul Keycloak sign-in brand design.
 */
export default function LocaleMenu({ i18n }: { i18n: I18n }) {
    const { currentLanguage, enabledLanguages } = i18n;
    const [open, setOpen] = useState(false);

    const locales = enabledLanguages ?? [];
    const currentTag = currentLanguage.languageTag;
    const currentLabel = LOCALE_LABELS[currentTag] ?? currentTag.toUpperCase().slice(0, 2);

    if (locales.length <= 1) return null;

    return (
        <div style={{ position: "relative" }}>
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                aria-haspopup="listbox"
                aria-expanded={open}
                style={{
                    height: "34px",
                    whiteSpace: "nowrap",
                    padding: "0 11px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    border: "1px solid var(--qh-border)",
                    borderRadius: "var(--qh-r-sm)",
                    background: "var(--qh-surface)",
                    color: "var(--qh-text)",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--qh-border-strong)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--qh-border)")}
            >
                <GlobeIcon />
                {currentLabel}
                <ChevronIcon />
            </button>

            {open && (
                <>
                    <div
                        style={{ position: "fixed", inset: 0, zIndex: 20 }}
                        onClick={() => setOpen(false)}
                    />
                    <div
                        role="listbox"
                        style={{
                            position: "absolute",
                            top: "40px",
                            right: 0,
                            minWidth: "150px",
                            background: "var(--qh-surface)",
                            border: "1px solid var(--qh-border)",
                            borderRadius: "var(--qh-r-sm)",
                            boxShadow: "0 8px 20px rgba(20,36,61,0.12)",
                            zIndex: 30,
                            padding: "2px",
                        }}
                    >
                        {locales.map(lang => {
                            const isCurrent = lang.languageTag === currentTag;
                            const label = LOCALE_LABELS[lang.languageTag] ?? lang.label;
                            return (
                                <a
                                    key={lang.languageTag}
                                    href={lang.href}
                                    lang={lang.languageTag}
                                    role="option"
                                    aria-selected={isCurrent}
                                    style={{
                                        width: "100%",
                                        textAlign: "left",
                                        height: "38px",
                                        padding: "0 12px",
                                        borderRadius: "var(--qh-r-sm)",
                                        background: isCurrent ? "var(--qh-bg)" : "transparent",
                                        color: isCurrent ? "var(--qh-text)" : "var(--qh-text-2)",
                                        fontSize: "14px",
                                        fontWeight: 600,
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                        textDecoration: "none",
                                    }}
                                    onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.background = "var(--qh-surface-2)")}
                                    onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.background = isCurrent ? "var(--qh-bg)" : "transparent")}
                                >
                                    <span
                                        style={{
                                            width: "24px",
                                            fontSize: "12px",
                                            fontWeight: 700,
                                            color: isCurrent ? "var(--qh-accent)" : "var(--qh-muted)",
                                        }}
                                    >
                                        {label}
                                    </span>
                                    {lang.label}
                                    <span
                                        style={{
                                            marginLeft: "auto",
                                            width: "8px",
                                            height: "8px",
                                            background: isCurrent ? "var(--qh-accent)" : "transparent",
                                            display: "block",
                                        }}
                                    />
                                </a>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}
