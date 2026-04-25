import { BsYinYang } from "react-icons/bs";
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
 * Displays app logo and title.
 */
/** Supported locales — only EN and CN are shown regardless of what Keycloak has enabled. */
const SUPPORTED_LOCALES = [
    { tag: "en",   label: "EN" },
    { tag: "zh-CN", label: "中文" },
] as const;

export default function Header({ kcContext: _kcContext, i18n }: HeaderProps) {
    const { currentLanguage, enabledLanguages } = i18n;

    // Build a lookup of Keycloak-provided hrefs for our two supported locales.
    // We match by prefix so "zh-CN", "zh_CN", "zh" all resolve correctly.
    const hrefFor = (tag: string) =>
        enabledLanguages?.find(l =>
            l.languageTag === tag || l.languageTag.startsWith(tag.split("-")[0])
        )?.href;

    const isCurrent = (tag: string) =>
        currentLanguage.languageTag === tag ||
        currentLanguage.languageTag.startsWith(tag.split("-")[0]);

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
                    <BsYinYang
                        size={26}
                        style={{
                            color: "#f59e0b",
                            filter: "drop-shadow(0 0 4px #f59e0b99) drop-shadow(0 0 1px #fbbf24)",
                        }}
                        aria-hidden="true"
                    />
                    <span
                        className="text-sm font-semibold uppercase tracking-[0.15em]"
                        style={{
                            background: "linear-gradient(90deg, var(--vg-gold-400), var(--vg-cyan-400))",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                        }}
                    >
                        Key to Marvel
                    </span>
                </div>

                {/* EN / 中文 toggle */}
                <nav aria-label="Language selection">
                    <ul className="flex items-center list-none m-0 p-0">
                        {SUPPORTED_LOCALES.map(({ tag, label }, idx) => {
                            const href = hrefFor(tag);
                            const active = isCurrent(tag);
                            return (
                                <li key={tag} className="flex items-center">
                                    {idx > 0 && (
                                        <span
                                            aria-hidden="true"
                                            style={{
                                                width: "1px",
                                                height: "12px",
                                                background: "var(--vg-border-default)",
                                                margin: "0 8px",
                                                display: "inline-block",
                                            }}
                                        />
                                    )}
                                    {active ? (
                                        <span
                                            aria-current="true"
                                            className="text-xs font-semibold"
                                            style={{ color: "var(--vg-cyan-400)" }}
                                        >
                                            {label}
                                        </span>
                                    ) : (
                                        <a
                                            href={href ?? "#"}
                                            lang={tag}
                                            className="text-xs font-semibold transition-colors"
                                            style={{ color: "var(--vg-text-muted)" }}
                                            onMouseEnter={e =>
                                                ((e.target as HTMLAnchorElement).style.color =
                                                    "var(--vg-text-primary)")
                                            }
                                            onMouseLeave={e =>
                                                ((e.target as HTMLAnchorElement).style.color =
                                                    "var(--vg-text-muted)")
                                            }
                                        >
                                            {label}
                                        </a>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>
        </header>
    );
}
