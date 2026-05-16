import { FlowDeskWordmark } from "@keycloak-theme/shared/ui";
import type { KcContext } from "./KcContext";
import type { I18n } from "./i18n";
import type { KcClsx } from "keycloakify/login/lib/kcClsx";

interface HeaderProps {
    kcContext: KcContext;
    i18n: I18n;
    kcClsx: KcClsx;
}

/** Supported locales — EN and CN. */
const SUPPORTED_LOCALES = [
    { tag: "en",    label: "EN" },
    { tag: "zh-CN", label: "中文" },
] as const;

/**
 * Header — FlowDesk Metro top navigation bar.
 *
 * Shows the FlowDesk wordmark on the left and a locale switcher on the right.
 * Matches the app's header chrome style: dark background with 2px bottom border.
 */
export default function Header({ kcContext: _kcContext, i18n }: HeaderProps) {
    const { currentLanguage, enabledLanguages } = i18n;

    const hrefFor = (tag: string) =>
        enabledLanguages?.find(l =>
            l.languageTag === tag || l.languageTag.startsWith(tag.split("-")[0])
        )?.href;

    const isCurrent = (tag: string) =>
        currentLanguage.languageTag === tag ||
        currentLanguage.languageTag.startsWith(tag.split("-")[0]);

    return (
        <header
            id="fd-header"
            className="fixed top-0 left-0 right-0 z-[var(--fd-z-overlay)] h-12"
            style={{
                background: "var(--fd-bg-surface)",
                borderBottom: "2px solid var(--fd-border-chrome)",
            }}
        >
            <div className="h-full flex items-center justify-between px-6">
                {/* Brand wordmark */}
                <FlowDeskWordmark size={28} />

                {/* EN / 中文 locale toggle */}
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
                                                background: "var(--fd-border-strong)",
                                                margin: "0 8px",
                                                display: "inline-block",
                                            }}
                                        />
                                    )}
                                    {active ? (
                                        <span
                                            aria-current="true"
                                            className="text-xs font-semibold"
                                            style={{ color: "var(--fd-blue-500)" }}
                                        >
                                            {label}
                                        </span>
                                    ) : (
                                        <a
                                            href={href ?? "#"}
                                            lang={tag}
                                            className="text-xs font-semibold transition-colors"
                                            style={{ color: "var(--fd-text-muted)" }}
                                            onMouseEnter={e =>
                                                ((e.target as HTMLAnchorElement).style.color = "var(--fd-text-primary)")
                                            }
                                            onMouseLeave={e =>
                                                ((e.target as HTMLAnchorElement).style.color = "var(--fd-text-muted)")
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
