import { useEffect, useState, type ReactNode } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { useSetClassName } from "keycloakify/tools/useSetClassName";
import { useInitialize } from "keycloakify/login/Template.useInitialize";
import type { I18n } from "./i18n";
import type { KcContext } from "./KcContext";
import { FdAlert } from "@keycloak-theme/shared/ui";

import "./template.css";

export type FdTemplateProps = TemplateProps<KcContext, I18n> & {
    layoutVariant?: "split";
    leftPanelNode?: ReactNode;
};

/* ── Mono-Q logo (matches favicon + brand panel) ── */
function QLogo({ size = 28 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ flexShrink: 0 }}>
            <rect x="2" y="2" width="28" height="28" rx="3" fill="var(--accent)" />
            <text x="16" y="23" textAnchor="middle" fontSize="20" fontWeight={700} fontFamily="var(--ui)" fill="var(--accent-ink)">Q</text>
        </svg>
    );
}

/* ── Segmented language selector (EN / 中 / FR) ── */
const LOCALES = [
    { tag: "en",    label: "EN" },
    { tag: "zh-CN", label: "中" },
    { tag: "fr",    label: "FR" },
] as const;

function LangSeg({ i18n }: { i18n: I18n }) {
    const { currentLanguage, enabledLanguages } = i18n;

    const hrefFor = (tag: string) =>
        enabledLanguages?.find(l =>
            l.languageTag === tag || l.languageTag.startsWith(tag.split("-")[0])
        )?.href;

    const isCurrent = (tag: string) =>
        currentLanguage.languageTag === tag ||
        currentLanguage.languageTag.startsWith(tag.split("-")[0]);

    return (
        <div
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 2,
                padding: 2,
                border: "1px solid var(--rule)",
                borderRadius: 5,
            }}
        >
            {LOCALES.map(({ tag, label }) => {
                const active = isCurrent(tag);
                const href = hrefFor(tag);
                const segBtn: React.CSSProperties = {
                    all: "unset" as never,
                    boxSizing: "border-box",
                    padding: "5px 9px",
                    fontFamily: "var(--mono)",
                    fontSize: "10.5px",
                    fontWeight: 600,
                    color: active ? "var(--text)" : "var(--text-faint)",
                    background: active ? "var(--field)" : "transparent",
                    borderRadius: 3,
                    letterSpacing: "0.04em",
                    cursor: active ? "default" : "pointer",
                };
                return active ? (
                    <span key={tag} style={segBtn} aria-current="true">{label}</span>
                ) : (
                    <a key={tag} href={href ?? "#"} lang={tag} style={segBtn}>{label}</a>
                );
            })}
        </div>
    );
}

/* ── Light/dark theme toggle (shares `whereq_theme` with the main site) ── */
const SUN_SVG = (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4"/>
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
    </svg>
);
const MOON_SVG = (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>
    </svg>
);

function ThemeToggle() {
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        try {
            const saved = localStorage.getItem("whereq_theme") ?? "dark";
            const dark = saved !== "light";
            setIsDark(dark);
            document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
        } catch { /* localStorage unavailable — keep default dark */ }
    }, []);

    const toggle = () => {
        const next = isDark ? "light" : "dark";
        setIsDark(!isDark);
        document.documentElement.setAttribute("data-theme", next);
        try { localStorage.setItem("whereq_theme", next); } catch { /* ignore persistence failure */ }
    };

    return (
        <button
            onClick={toggle}
            aria-label="Toggle theme"
            title="Toggle theme"
            style={{
                all: "unset",
                width: 30,
                height: 30,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid var(--rule)",
                borderRadius: 5,
                color: "var(--text-dim)",
                cursor: "pointer",
            }}
        >
            {isDark ? MOON_SVG : SUN_SVG}
        </button>
    );
}

/* ── Mobile brand bar (shown when the showcase is hidden on mobile) ── */
function MobileBar() {
    return (
        <div className="fd-mobilebar">
            <QLogo size={26} />
            <span style={{ fontFamily: "var(--ui)", fontSize: 16, fontWeight: 700, letterSpacing: "-0.01em", color: "var(--text-warm)" }}>
                whereq<span style={{ color: "var(--accent)" }}>.</span>com
            </span>
            <span style={{
                marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 6,
                fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.08em", color: "var(--text-faint)",
            }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)" }} />
                MAP OS
            </span>
        </div>
    );
}

/* ── Slim status / copyright footer ── */
function SiteFooter({ i18n }: { i18n: I18n }) {
    const { msgStr } = i18n;
    const chips = [
        { c: "var(--success)", label: "PLACES · LIVE", glow: true },
        { c: "var(--info)", label: "ROUTES · READY" },
        { c: "var(--accent)", label: "MAPS · SYNCED" },
    ];
    return (
        <footer style={{
            padding: "11px 56px",
            borderTop: "1px solid var(--rule)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: "var(--mono)",
            fontSize: 10.5,
            letterSpacing: "0.03em",
            color: "var(--text-faint)",
            flexWrap: "wrap",
            gap: 12,
        }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                {chips.map(ch => (
                    <span key={ch.label} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: ch.c, boxShadow: ch.glow ? "0 0 0 2px rgba(74,222,128,.18)" : undefined }} />
                        {ch.label}
                    </span>
                ))}
            </span>
            <span>
                © {new Date().getFullYear()}{" "}
                <a href="https://www.whereq.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", textDecoration: "none" }}>whereq.com</a>
                {" "}· {msgStr("footTagline")}
            </span>
        </footer>
    );
}

export default function Template(props: FdTemplateProps) {
    const {
        displayInfo = false,
        displayMessage = true,
        displayRequiredFields = false,
        headerNode,
        socialProvidersNode = null,
        infoNode = null,
        documentTitle,
        bodyClassName,
        kcContext,
        i18n,
        doUseDefaultCss,
        classes,
        children,
        layoutVariant,
        leftPanelNode,
    } = props;

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });
    const { msgStr, currentLanguage } = i18n;
    const { auth, url, message, isAppInitiatedAction } = kcContext;

    useEffect(() => {
        document.title = documentTitle ?? msgStr("loginTitle", kcContext.realm.displayName);
    }, [documentTitle, kcContext.realm.displayName, msgStr]);

    useSetClassName({ qualifiedName: "html", className: kcClsx("kcHtmlClass") });
    useSetClassName({ qualifiedName: "body", className: bodyClassName ?? kcClsx("kcBodyClass") });

    const { isReadyToRender } = useInitialize({ kcContext, doUseDefaultCss });
    if (!isReadyToRender) return null;

    const isSplit = layoutVariant === "split";

    /* ── Form card (used in both split and non-split) ── */
    const cardInner = (
        <>
            {/* Title section */}
            <div style={{ marginBottom: 24 }}>
                {(() => {
                    if (auth !== undefined && auth.showUsername && !auth.showResetCredentials) {
                        return (
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                                <span style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text)" }}>
                                    {auth.attemptedUsername}
                                </span>
                                <a href={url.loginRestartFlowUrl} style={{ fontSize: "0.75rem", color: "var(--accent)" }}>
                                    {msgStr("restartLoginTooltip")}
                                </a>
                            </div>
                        );
                    }
                    return (
                        <>
                            {displayRequiredFields && (
                                <div style={{ marginBottom: 4, textAlign: "right", fontSize: "0.75rem", color: "var(--text-faint)" }}>
                                    <span style={{ color: "var(--down)" }}>*</span> {msgStr("requiredFields")}
                                </div>
                            )}
                            {headerNode}
                        </>
                    );
                })()}
            </div>

            {/* Flash message */}
            {displayMessage && message !== undefined && (
                <div style={{ marginBottom: 20 }}>
                    <FdAlert
                        type={
                            message.type === "error" ? "error"
                            : message.type === "success" ? "success"
                            : message.type === "warning" ? "warning"
                            : "info"
                        }
                    >
                        <span dangerouslySetInnerHTML={{ __html: kcSanitize(message.summary) }} />
                    </FdAlert>
                </div>
            )}

            {/* Page content */}
            {children as ReactNode}

            {/* Social providers */}
            {socialProvidersNode && <div style={{ marginTop: 20 }}>{socialProvidersNode}</div>}

            {/* Try another way */}
            {auth !== undefined && auth.showTryAnotherWayLink && (
                <form id="kc-select-try-another-way-form" action={url.loginAction} method="post" style={{ marginTop: 16, textAlign: "center" }}>
                    <input type="hidden" name="tryAnotherWay" value="on" />
                    <button type="submit" style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: "0.8rem", textDecoration: "underline" }}>
                        {msgStr("doTryAnotherWay")}
                    </button>
                </form>
            )}

            {/* Info section */}
            {displayInfo && infoNode && (
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--rule)", fontSize: "0.82rem", color: "var(--text-dim)", textAlign: "center" }}>
                    {infoNode}
                </div>
            )}

            {/* App-initiated action cancel */}
            {isAppInitiatedAction && (
                <div style={{ marginTop: 16, textAlign: "center" }}>
                    <a href={url.loginRestartFlowUrl} style={{ fontSize: "0.8rem", color: "var(--text-faint)" }}>
                        {msgStr("doCancel")}
                    </a>
                </div>
            )}
        </>
    );

    /* ── Split layout ── */
    if (isSplit) {
        return (
            <div id="fd-root" className="fd-split-root" lang={currentLanguage.languageTag}>
                {/* Left: brand showcase */}
                <div className="fd-split-brand">
                    {leftPanelNode}
                </div>

                {/* Right: form panel */}
                <div className="fd-formside">
                    <MobileBar />

                    {/* Topbar: lang + theme */}
                    <div className="fd-topbar">
                        <LangSeg i18n={i18n} />
                        <ThemeToggle />
                    </div>

                    {/* Form card */}
                    <div className="fd-formscroll">
                        <div className="fd-formcard">
                            {cardInner}
                        </div>
                    </div>

                    {/* Footer */}
                    <SiteFooter i18n={i18n} />
                </div>
            </div>
        );
    }

    /* ── Non-split layout (all other Keycloak pages) ── */
    return (
        <div id="fd-root" lang={currentLanguage.languageTag} style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            {/* Minimal topbar with brand */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "16px 28px", borderBottom: "1px solid var(--rule)" }}>
                <a href="https://www.whereq.com" style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
                    <QLogo size={26} />
                    <span style={{ fontFamily: "var(--ui)", fontSize: 16, fontWeight: 700, letterSpacing: "-0.01em", color: "var(--text-warm)" }}>
                        whereq<span style={{ color: "var(--accent)" }}>.</span>com
                    </span>
                </a>
                <span style={{ flex: 1 }} />
                <LangSeg i18n={i18n} />
                <ThemeToggle />
            </div>

            <main id="fd-main">
                <div id="fd-login-card">
                    <div id="fd-card-header" style={{ padding: "24px 28px 0" }}>
                        <h1 id="kc-page-title" style={{ margin: 0, fontSize: "1.4rem", fontWeight: 700, color: "var(--text-warm)", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
                            {headerNode}
                        </h1>
                    </div>
                    <div id="fd-card-body" style={{ padding: "20px 28px 28px" }}>
                        {cardInner}
                    </div>
                </div>
            </main>

            <SiteFooter i18n={i18n} />
        </div>
    );
}
