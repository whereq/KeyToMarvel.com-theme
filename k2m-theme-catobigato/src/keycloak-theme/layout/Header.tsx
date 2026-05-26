import type { KcContext } from "./KcContext";
import type { I18n } from "./i18n";
import type { KcClsx } from "keycloakify/login/lib/kcClsx";

interface HeaderProps {
    kcContext: KcContext;
    i18n: I18n;
    kcClsx: KcClsx;
}

const SUPPORTED_LOCALES = [
    { tag: "en",    label: "EN" },
    { tag: "zh-CN", label: "中文" },
    { tag: "fr",    label: "FR" },
] as const;

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
            id="cb-header"
            className="fixed top-0 left-0 right-0 z-[var(--cb-z-overlay)] h-12"
            style={{
                background: "rgba(250, 245, 236, 0.92)",
                backdropFilter: "blur(12px)",
                borderBottom: "1px solid var(--cb-border-subtle)",
            }}
        >
            <div className="h-full flex items-center justify-between px-6">
                {/* Brand */}
                <div className="flex items-center gap-2.5">
                    <img
                        src={`${import.meta.env.BASE_URL}resources/img/catobi-head.png`}
                        alt="CatoBigato"
                        style={{ width: 28, height: 28, borderRadius: "50%" }}
                    />
                    <span
                        className="text-sm font-bold tracking-wide"
                        style={{ color: "var(--cb-orange-400)" }}
                    >
                        CatoBigato
                    </span>
                </div>

                {/* Language toggle */}
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
                                                background: "var(--cb-border-default)",
                                                margin: "0 8px",
                                                display: "inline-block",
                                            }}
                                        />
                                    )}
                                    {active ? (
                                        <span
                                            aria-current="true"
                                            className="text-xs font-semibold"
                                            style={{ color: "var(--cb-orange-400)" }}
                                        >
                                            {label}
                                        </span>
                                    ) : (
                                        <a
                                            href={href ?? "#"}
                                            lang={tag}
                                            className="text-xs font-semibold transition-colors"
                                            style={{ color: "var(--cb-text-muted)" }}
                                            onMouseEnter={e =>
                                                ((e.target as HTMLAnchorElement).style.color =
                                                    "var(--cb-text-primary)")
                                            }
                                            onMouseLeave={e =>
                                                ((e.target as HTMLAnchorElement).style.color =
                                                    "var(--cb-text-muted)")
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
