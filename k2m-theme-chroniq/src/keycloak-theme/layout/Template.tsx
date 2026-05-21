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
import { CqAlert } from "@keycloak-theme/shared/ui";

import "./template.css";

export type CqTemplateProps = TemplateProps<KcContext, I18n> & {
    /** "split" renders two-column: brand panel left, card right. */
    layoutVariant?: "split";
    /** Content for the left brand panel when layoutVariant="split". */
    leftPanelNode?: ReactNode;
};

export default function Template(props: CqTemplateProps) {
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
            id="cq-login-card"
            style={{
                width: "100%",
                maxWidth: isSplit ? "380px" : "420px",
                background: "var(--cq-surface)",
                border: "1px solid var(--cq-border)",
                borderTop: `3px solid var(--cq-accent)`,
                borderRadius: "var(--cq-r-sm)",
            }}
        >
            {/* Card header */}
            <div id="cq-card-header" style={{ padding: "28px 28px 0" }}>
                {(() => {
                    if (auth !== undefined && auth.showUsername && !auth.showResetCredentials) {
                        return (
                            <div className="flex items-center justify-between mb-2">
                                <span
                                    id="kc-attempted-username"
                                    style={{
                                        fontSize: "1rem",
                                        fontWeight: 600,
                                        color: "var(--cq-text)",
                                        fontFamily: "var(--cq-font-display)",
                                    }}
                                >
                                    {auth.attemptedUsername}
                                </span>
                                <a
                                    id="reset-login"
                                    href={url.loginRestartFlowUrl}
                                    aria-label={msgStr("restartLoginTooltip")}
                                    style={{ fontSize: "0.75rem", color: "var(--cq-accent)" }}
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
                                fontSize: "1.35rem",
                                fontWeight: 700,
                                color: "var(--cq-text)",
                                letterSpacing: "-0.02em",
                                lineHeight: 1.2,
                                fontFamily: "var(--cq-font-display)",
                            }}
                        >
                            {headerNode}
                        </h1>
                    );

                    if (displayRequiredFields) {
                        return (
                            <div className="flex items-start justify-between">
                                {titleNode}
                                <span style={{ fontSize: "0.75rem", color: "var(--cq-muted)" }}>
                                    <span style={{ color: "var(--cq-error)" }}>*</span>{" "}
                                    {msg("requiredFields")}
                                </span>
                            </div>
                        );
                    }

                    return titleNode;
                })()}
            </div>

            {/* Card body */}
            <div id="cq-card-body" style={{ padding: "20px 28px 28px" }}>
                {/* Flash message */}
                {displayMessage && message !== undefined && (
                    <div className="mb-5">
                        <CqAlert
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
                        </CqAlert>
                    </div>
                )}

                {/* Page content */}
                {children as ReactNode}

                {/* Social providers */}
                {socialProvidersNode && (
                    <div id="cq-social" className="mt-5">
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
                                color: "var(--cq-accent)",
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
                            borderTop: "1px solid var(--cq-border)",
                        }}
                    >
                        <div
                            id="kc-info-message"
                            style={{
                                fontSize: "0.82rem",
                                color: "var(--cq-text-2)",
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
                            style={{ fontSize: "0.8rem", color: "var(--cq-muted)" }}
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
            id="cq-root"
            lang={currentLanguage.languageTag}
            style={{
                minHeight: "100dvh",
                background: "var(--cq-bg)",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Header kcContext={kcContext} i18n={i18n} kcClsx={kcClsx} />

            {isSplit ? (
                <main id="cq-main" className="cq-split">
                    <div className="cq-split-brand">
                        {leftPanelNode}
                    </div>
                    <div className="cq-split-card-wrap">
                        {card}
                    </div>
                </main>
            ) : (
                <main id="cq-main">
                    {card}
                </main>
            )}

            <Footer i18n={i18n} />
        </div>
    );
}
