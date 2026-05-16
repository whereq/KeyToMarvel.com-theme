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
import { FdAlert } from "@keycloak-theme/shared/ui";

import "./template.css";

export type FdTemplateProps = TemplateProps<KcContext, I18n> & {
    /** "split" renders two-column: brand panel left, card right. */
    layoutVariant?: "split";
    /** Content for the left brand panel when layoutVariant="split". */
    leftPanelNode?: ReactNode;
};

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

    const isSplit = layoutVariant === "split";

    /* ── Login card ── */
    const card = (
        <div
            id="fd-login-card"
            style={{
                width: "100%",
                maxWidth: isSplit ? "420px" : "440px",
                background: "var(--fd-bg-card)",
                border: "1px solid var(--fd-border-default)",
                borderTop: "2px solid var(--fd-blue-500)",
            }}
        >
            {/* Card header */}
            <div id="fd-card-header" style={{ padding: "28px 28px 0" }}>
                {(() => {
                    if (auth !== undefined && auth.showUsername && !auth.showResetCredentials) {
                        return (
                            <div className="flex items-center justify-between mb-2">
                                <span
                                    id="kc-attempted-username"
                                    style={{
                                        fontSize: "1rem",
                                        fontWeight: 600,
                                        color: "var(--fd-text-primary)",
                                    }}
                                >
                                    {auth.attemptedUsername}
                                </span>
                                <a
                                    id="reset-login"
                                    href={url.loginRestartFlowUrl}
                                    aria-label={msgStr("restartLoginTooltip")}
                                    style={{ fontSize: "0.75rem", color: "var(--fd-blue-500)" }}
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
                                color: "var(--fd-text-primary)",
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
                                <span style={{ fontSize: "0.75rem", color: "var(--fd-text-muted)" }}>
                                    <span style={{ color: "var(--fd-error)" }}>*</span>{" "}
                                    {msg("requiredFields")}
                                </span>
                            </div>
                        );
                    }

                    return titleNode;
                })()}
            </div>

            {/* Card body */}
            <div id="fd-card-body" style={{ padding: "20px 28px 28px" }}>
                {/* Flash message */}
                {displayMessage && message !== undefined && (
                    <div className="mb-5">
                        <FdAlert
                            type={
                                message.type === "error"
                                    ? "error"
                                    : message.type === "success"
                                        ? "success"
                                        : message.type === "warning"
                                            ? "warning"
                                            : "info"
                            }
                        >
                            <span
                                dangerouslySetInnerHTML={{ __html: kcSanitize(message.summary) }}
                            />
                        </FdAlert>
                    </div>
                )}

                {/* Page content */}
                {children as ReactNode}

                {/* Social providers */}
                {socialProvidersNode && (
                    <div id="fd-social" className="mt-5">
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
                                color: "var(--fd-blue-500)",
                                cursor: "pointer",
                                fontSize: "0.8rem",
                                textDecoration: "underline",
                            }}
                        >
                            {msg("doTryAnotherWay")}
                        </button>
                    </form>
                )}

                {/* Info section */}
                {displayInfo && infoNode && (
                    <div
                        id="kc-info"
                        style={{
                            marginTop: "16px",
                            paddingTop: "16px",
                            borderTop: "1px solid var(--fd-border-subtle)",
                        }}
                    >
                        <div
                            id="kc-info-message"
                            style={{
                                fontSize: "0.82rem",
                                color: "var(--fd-text-secondary)",
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
                            style={{ fontSize: "0.8rem", color: "var(--fd-text-muted)" }}
                        >
                            {msg("doCancel")}
                        </a>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div
            id="fd-root"
            lang={currentLanguage.languageTag}
            style={{
                minHeight: "100vh",
                background: "var(--fd-bg-base)",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Header kcContext={kcContext} i18n={i18n} kcClsx={kcClsx} />

            {isSplit ? (
                <main id="fd-main" className="fd-split">
                    <div className="fd-split-brand">
                        {leftPanelNode}
                    </div>
                    <div className="fd-split-card-wrap">
                        {card}
                    </div>
                </main>
            ) : (
                <main
                    id="fd-main"
                    style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "80px 24px 60px",
                    }}
                >
                    {card}
                </main>
            )}

            <Footer />
        </div>
    );
}
