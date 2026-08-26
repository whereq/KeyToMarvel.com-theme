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

/* ── whereq.cc pin logo (matches favicon + brand panel) ── */
function QLogo({ size = 28 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" style={{ flexShrink: 0 }} aria-label="whereq.cc">
            <rect width="40" height="40" rx="3" fill="var(--accent)" />
            <circle cx="20" cy="17.5" r="7.4" stroke="#fff" strokeWidth="3.2" />
            <path d="M20 25.2 L20 33.5 L25.6 27.4 Z" fill="#fff" />
        </svg>
    );
}

/* ── Wordmark: whereq.cc ── */
function Wordmark({ size = 16 }: { size?: number }) {
    return (
        <span style={{ fontFamily: "var(--display)", fontSize: size, fontWeight: 800, letterSpacing: "-0.02em", color: "var(--text-warm)" }}>
            whereq<span style={{ color: "var(--accent)" }}>.cc</span>
        </span>
    );
}

/* ── Segmented language selector (EN / 中文) ── */
const LOCALES = [
    { tag: "en",    label: "EN" },
    { tag: "zh-CN", label: "中文" },
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

/* ── Light/dark theme toggle (persists `whereqcc_theme` for this origin) ── */
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
            const saved = localStorage.getItem("whereqcc_theme") ?? "dark";
            const dark = saved !== "light";
            setIsDark(dark);
            document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
        } catch { /* localStorage unavailable — keep default dark */ }
    }, []);

    const toggle = () => {
        const next = isDark ? "light" : "dark";
        setIsDark(!isDark);
        document.documentElement.setAttribute("data-theme", next);
        try { localStorage.setItem("whereqcc_theme", next); } catch { /* ignore persistence failure */ }
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

/* ── Shield glyph (footer + security notes) ── */
const ShieldGlyph = (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l7 3v6c0 4.4-2.9 7.6-7 9-4.1-1.4-7-4.6-7-9V6z" />
    </svg>
);

/* ── Mobile brand bar (shown when the showcase is hidden on mobile) ── */
function MobileBar({ i18n }: { i18n: I18n }) {
    const { msgStr } = i18n;
    return (
        <div className="fd-mobilebar">
            <QLogo size={26} />
            <Wordmark size={16} />
            <span style={{
                marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 6,
                fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-faint)",
            }}>
                <span style={{ width: 6, height: 6, background: "var(--accent)" }} />
                {msgStr("tagGallery")}
            </span>
        </div>
    );
}

/* ── Slim status / copyright footer ── */
function SiteFooter({ i18n }: { i18n: I18n }) {
    const { msgStr } = i18n;
    return (
        <footer style={{
            padding: "11px 56px",
            borderTop: "1px solid var(--rule)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: "var(--mono)",
            fontSize: 11,
            letterSpacing: "0.02em",
            color: "var(--text-faint)",
            flexWrap: "wrap",
            gap: 12,
        }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 7, color: "var(--accent)" }}>
                    {ShieldGlyph}
                    {msgStr("footerKeys")}
                </span>
                <span style={{ opacity: 0.4 }}>/</span>
                <a href="#" style={{ color: "var(--text-faint)" }}>{msgStr("footPrivacy")}</a>
                <span style={{ opacity: 0.4 }}>/</span>
                <a href="#" style={{ color: "var(--text-faint)" }}>{msgStr("footTerms")}</a>
            </span>
            <span>
                © {new Date().getFullYear()}{" "}
                <a href="https://whereq.cc" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", textDecoration: "none" }}>whereq.cc</a>
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
                    <MobileBar i18n={i18n} />

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
                <a href="https://whereq.cc" style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
                    <QLogo size={26} />
                    <Wordmark size={16} />
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
