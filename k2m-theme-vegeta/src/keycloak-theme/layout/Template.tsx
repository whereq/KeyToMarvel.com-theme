import { useEffect, type ReactNode } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { useSetClassName } from "keycloakify/tools/useSetClassName";
import { useInitialize } from "keycloakify/login/Template.useInitialize";
import type { I18n } from "./i18n";
import type { KcContext } from "./KcContext";
import Header from "./Header";
import Footer from "./Footer";
import { VgAlert } from "@keycloak-theme/shared/ui";

import "./template.css";

export default function Template(props: TemplateProps<KcContext, I18n>) {
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
    } = props;

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });
    const { msg, msgStr, currentLanguage } = i18n;
    const { auth, url, message, isAppInitiatedAction } = kcContext;

    useEffect(() => {
        document.title = documentTitle ?? msgStr("loginTitle", kcContext.realm.displayName);
    }, [documentTitle, kcContext.realm.displayName, msgStr]);

    useSetClassName({ qualifiedName: "html", className: kcClsx("kcHtmlClass") });
    useSetClassName({
        qualifiedName: "body",
        className: bodyClassName ?? kcClsx("kcBodyClass"),
    });

    const { isReadyToRender } = useInitialize({ kcContext, doUseDefaultCss });
    if (!isReadyToRender) return null;

    return (
        <div
            id="vg-root"
            lang={currentLanguage.languageTag}
            style={{
                minHeight: "100vh",
                background: "var(--vg-bg-base)",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* ── Top navigation bar ── */}
            <Header kcContext={kcContext} i18n={i18n} kcClsx={kcClsx} />

            {/* ── Main scrollable area (padded for fixed header + footer) ── */}
            <main
                id="vg-main"
                style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingTop: "64px",
                    paddingBottom: "56px",
                    padding: "80px 24px 60px",
                }}
            >
                {/* ── Login card — MetroUI flat panel with cyan top-accent ── */}
                <div
                    id="vg-login-card"
                    style={{
                        width: "100%",
                        maxWidth: "440px",
                        background: "var(--vg-bg-card)",
                        border: "1px solid var(--vg-border-subtle)",
                        borderTop: "3px solid var(--vg-cyan-400)",
                        borderRadius: "var(--vg-radius-md)",
                    }}
                >
                    {/* Card header */}
                    <div
                        id="vg-card-header"
                        style={{
                            padding: "28px 28px 0",
                        }}
                    >
                        {/* Page title */}
                        {(() => {
                            if (auth !== undefined && auth.showUsername && !auth.showResetCredentials) {
                                return (
                                    <div className="flex items-center justify-between mb-2">
                                        <span
                                            id="kc-attempted-username"
                                            style={{
                                                fontSize: "1rem",
                                                fontWeight: 600,
                                                color: "var(--vg-text-primary)",
                                            }}
                                        >
                                            {auth.attemptedUsername}
                                        </span>
                                        <a
                                            id="reset-login"
                                            href={url.loginRestartFlowUrl}
                                            aria-label={msgStr("restartLoginTooltip")}
                                            style={{
                                                fontSize: "0.75rem",
                                                color: "var(--vg-cyan-400)",
                                            }}
                                        >
                                            {msg("restartLoginTooltip")}
                                        </a>
                                    </div>
                                );
                            }

                            const titleNode = (
                                <h1
                                    id="kc-page-title"
                                    style={{
                                        margin: "0 0 4px",
                                        fontSize: "1.4rem",
                                        fontWeight: 700,
                                        color: "var(--vg-text-primary)",
                                        letterSpacing: "-0.01em",
                                        lineHeight: 1.2,
                                    }}
                                >
                                    {headerNode}
                                </h1>
                            );

                            if (displayRequiredFields) {
                                return (
                                    <div className="flex items-start justify-between">
                                        {titleNode}
                                        <span
                                            style={{
                                                fontSize: "0.75rem",
                                                color: "var(--vg-text-muted)",
                                            }}
                                        >
                                            <span style={{ color: "var(--vg-error)" }}>*</span>{" "}
                                            {msg("requiredFields")}
                                        </span>
                                    </div>
                                );
                            }

                            return titleNode;
                        })()}
                    </div>

                    {/* Card body */}
                    <div id="vg-card-body" style={{ padding: "20px 28px 28px" }}>
                        {/* Flash message */}
                        {displayMessage && message !== undefined && message.type !== "warning" && (
                            <div className="mb-5">
                                <VgAlert
                                    type={
                                        message.type === "error"
                                            ? "error"
                                            : message.type === "success"
                                                ? "success"
                                                : "info"
                                    }
                                >
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: kcSanitize(message.summary),
                                        }}
                                    />
                                </VgAlert>
                            </div>
                        )}
                        {displayMessage && message !== undefined && message.type === "warning" && (
                            <div className="mb-5">
                                <VgAlert type="warning">
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: kcSanitize(message.summary),
                                        }}
                                    />
                                </VgAlert>
                            </div>
                        )}

                        {/* Page content (form) */}
                        {children as ReactNode}

                        {/* Social providers */}
                        {socialProvidersNode && (
                            <div id="vg-social" className="mt-5">
                                {socialProvidersNode}
                            </div>
                        )}

                        {/* Try another way */}
                        {auth !== undefined && auth.showTryAnotherWayLink && (
                            <form
                                id="kc-select-try-another-way-form"
                                action={url.loginAction}
                                method="post"
                                className="mt-4 text-center"
                            >
                                <input type="hidden" name="tryAnotherWay" value="on" />
                                <button
                                    type="submit"
                                    id="try-another-way"
                                    style={{
                                        background: "none",
                                        border: "none",
                                        color: "var(--vg-cyan-400)",
                                        cursor: "pointer",
                                        fontSize: "0.8rem",
                                        textDecoration: "underline",
                                    }}
                                >
                                    {msg("doTryAnotherWay")}
                                </button>
                            </form>
                        )}

                        {/* Info section (e.g., "back to login" link) */}
                        {displayInfo && infoNode && (
                            <div
                                id="kc-info"
                                style={{
                                    marginTop: "16px",
                                    paddingTop: "16px",
                                    borderTop: "1px solid var(--vg-border-subtle)",
                                }}
                            >
                                <div
                                    id="kc-info-message"
                                    style={{
                                        fontSize: "0.82rem",
                                        color: "var(--vg-text-secondary)",
                                        textAlign: "center",
                                    }}
                                >
                                    {infoNode}
                                </div>
                            </div>
                        )}

                        {/* App-initiated action cancel */}
                        {isAppInitiatedAction && (
                            <div className="mt-4 text-center">
                                <a
                                    href={url.loginRestartFlowUrl}
                                    style={{
                                        fontSize: "0.8rem",
                                        color: "var(--vg-text-muted)",
                                    }}
                                >
                                    {msg("doCancel")}
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* ── Bottom bar ── */}
            <Footer />
        </div>
    );
}
