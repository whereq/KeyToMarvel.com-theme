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
import { CbAlert } from "@keycloak-theme/shared/ui";

import "./template.css";

export type CbTemplateProps = TemplateProps<KcContext, I18n> & {
    layoutVariant?: "split";
    leftPanelNode?: ReactNode;
};

export default function Template(props: CbTemplateProps) {
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

    const card = (
        <div
            id="cb-login-card"
            style={{
                width: "100%",
                maxWidth: isSplit ? "420px" : "440px",
                background: "var(--cb-bg-card)",
                border: "1px solid var(--cb-border-subtle)",
                borderTop: "3px solid var(--cb-orange-400)",
                borderRadius: "var(--cb-radius-md)",
                boxShadow: "var(--cb-shadow-card)",
            }}
        >
            {/* Card header */}
            <div id="cb-card-header" style={{ padding: "28px 28px 0" }}>
                {(() => {
                    if (auth !== undefined && auth.showUsername && !auth.showResetCredentials) {
                        return (
                            <div className="flex items-center justify-between mb-2">
                                <span
                                    id="kc-attempted-username"
                                    style={{
                                        fontSize: "1rem",
                                        fontWeight: 600,
                                        color: "var(--cb-text-primary)",
                                    }}
                                >
                                    {auth.attemptedUsername}
                                </span>
                                <a
                                    id="reset-login"
                                    href={url.loginRestartFlowUrl}
                                    aria-label={msgStr("restartLoginTooltip")}
                                    style={{ fontSize: "0.75rem", color: "var(--cb-purple-500)" }}
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
                                color: "var(--cb-text-primary)",
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
                                <span style={{ fontSize: "0.75rem", color: "var(--cb-text-muted)" }}>
                                    <span style={{ color: "var(--cb-error)" }}>*</span>{" "}
                                    {msg("requiredFields")}
                                </span>
                            </div>
                        );
                    }

                    return titleNode;
                })()}
            </div>

            {/* Card body */}
            <div id="cb-card-body" style={{ padding: "20px 28px 28px" }}>
                {displayMessage && message !== undefined && (
                    <div className="mb-5">
                        <CbAlert
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
                        </CbAlert>
                    </div>
                )}

                {children as ReactNode}

                {socialProvidersNode && (
                    <div id="cb-social" className="mt-5">
                        {socialProvidersNode}
                    </div>
                )}

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
                                color: "var(--cb-purple-500)",
                                cursor: "pointer",
                                fontSize: "0.8rem",
                                textDecoration: "underline",
                            }}
                        >
                            {msg("doTryAnotherWay")}
                        </button>
                    </form>
                )}

                {displayInfo && infoNode && (
                    <div
                        id="kc-info"
                        style={{
                            marginTop: "16px",
                            paddingTop: "16px",
                            borderTop: "1px solid var(--cb-border-subtle)",
                        }}
                    >
                        <div
                            id="kc-info-message"
                            style={{
                                fontSize: "0.82rem",
                                color: "var(--cb-text-secondary)",
                                textAlign: "center",
                            }}
                        >
                            {infoNode}
                        </div>
                    </div>
                )}

                {isAppInitiatedAction && (
                    <div className="mt-4 text-center">
                        <a
                            href={url.loginRestartFlowUrl}
                            style={{ fontSize: "0.8rem", color: "var(--cb-text-muted)" }}
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
            id="cb-root"
            lang={currentLanguage.languageTag}
            style={{
                minHeight: "100vh",
                background: "var(--cb-bg-base)",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Header kcContext={kcContext} i18n={i18n} kcClsx={kcClsx} />

            {isSplit ? (
                <main id="cb-main" className="cb-split">
                    <div className="cb-split-brand">
                        {leftPanelNode}
                    </div>
                    <div className="cb-split-card-wrap">
                        {card}
                    </div>
                </main>
            ) : (
                <main
                    id="cb-main"
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
