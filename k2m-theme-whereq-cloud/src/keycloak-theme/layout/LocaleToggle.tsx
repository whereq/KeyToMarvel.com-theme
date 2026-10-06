import type { I18n } from "./i18n";

/** Short locale labels for the compact toggle button (e.g. "EN", "中文"). */
const LOCALE_LABELS: Record<string, string> = {
    "en": "EN",
    "zh-CN": "中文",
};

/**
 * LocaleToggle — compact "EN / 中文" button, per brand design (a two-way
 * toggle, not a dropdown — whereq.cloud ships exactly two locales).
 * Clicking navigates to whichever supported locale isn't currently active.
 */
export default function LocaleToggle({ i18n }: { i18n: I18n }) {
    const { currentLanguage, enabledLanguages } = i18n;
    const locales = enabledLanguages ?? [];

    if (locales.length <= 1) return null;

    const currentTag = currentLanguage.languageTag;
    const other = locales.find(l => l.languageTag !== currentTag) ?? locales[0];

    return (
        <a
            href={other.href}
            lang={other.languageTag}
            style={{
                height: "30px",
                padding: "0 10px",
                display: "flex",
                alignItems: "center",
                border: "1px solid var(--wqc-border-strong)",
                background: "var(--wqc-surface)",
                color: "var(--wqc-text)",
                borderRadius: "var(--wqc-r-sm)",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                whiteSpace: "nowrap",
                textDecoration: "none",
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--wqc-accent)")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--wqc-border-strong)")}
        >
            {locales.map(l => LOCALE_LABELS[l.languageTag] ?? l.label).join(" / ")}
        </a>
    );
}
