import type { KcContext } from "./KcContext";
import type { I18n } from "./i18n";
import type { KcClsx } from "keycloakify/login/lib/kcClsx";

interface HeaderProps {
    kcContext: KcContext;
    i18n: I18n;
    kcClsx: KcClsx;
}

/**
 * Header — MetroUI top navigation bar for the login theme.
 *
 * Frontend accent (cyan) — this is a user-facing surface.
 * Displays realm name and optional language switcher slot.
 */
export default function Header({ kcContext, i18n }: HeaderProps) {
    const { realm } = kcContext;
    const { currentLanguage, enabledLanguages } = i18n;

    return (
        <header
            id="vg-header"
            className="fixed top-0 left-0 right-0 z-[var(--vg-z-overlay)] h-12"
            style={{
                background: "var(--vg-bg-surface)",
                borderBottom: "1px solid var(--vg-border-subtle)",
            }}
        >
            <div className="h-full flex items-center justify-between px-6">
                {/* Brand */}
                <div className="flex items-center gap-3">
                    {/* Metro accent tile */}
                    <div
                        className="h-7 w-1.5 rounded-[var(--vg-radius-sm)]"
                        style={{ background: "var(--vg-cyan-400)" }}
                        aria-hidden="true"
                    />
                    <span
                        className="text-sm font-semibold uppercase tracking-[0.15em]"
                        style={{ color: "var(--vg-text-primary)" }}
                    >
                        {realm.displayName ?? realm.name}
                    </span>
                </div>

                {/* Language selector */}
                {enabledLanguages && enabledLanguages.length > 1 && (
                    <nav aria-label="Language selection">
                        <ul className="flex items-center gap-1 list-none m-0 p-0">
                            {enabledLanguages.map(lang => (
                                <li key={lang.languageTag}>
                                    <a
                                        href={lang.href}
                                        lang={lang.languageTag}
                                        aria-current={
                                            lang.languageTag === currentLanguage.languageTag
                                                ? "true"
                                                : undefined
                                        }
                                        className="px-2 py-1 text-xs font-semibold uppercase tracking-wider rounded-[var(--vg-radius-sm)] transition-colors"
                                        style={
                                            lang.languageTag === currentLanguage.languageTag
                                                ? {
                                                      color: "var(--vg-cyan-400)",
                                                      background: "var(--vg-frontend-bg)",
                                                  }
                                                : {
                                                      color: "var(--vg-text-muted)",
                                                  }
                                        }
                                    >
                                        {lang.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                )}
            </div>
        </header>
    );
}
