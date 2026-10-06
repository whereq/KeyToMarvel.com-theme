import { useEffect, type ReactNode } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { useSetClassName } from "keycloakify/tools/useSetClassName";
import { useInitialize } from "keycloakify/login/Template.useInitialize";
import type { I18n } from "./i18n";
import type { KcContext } from "./KcContext";
import LocaleMenu from "./LocaleMenu";
import { QhAlert, QHaulBrandMark } from "@keycloak-theme/shared/ui";
import faviconUrl from "@keycloak-theme/shared/assets/qhaul-mark.png";

import "./template.css";

export type QhTemplateProps = TemplateProps<KcContext, I18n> & {
    /** "split" renders the two-column brand design: aside panel left, pane right. */
    layoutVariant?: "split";
    /** Content for the left brand panel when layoutVariant="split". */
    leftPanelNode?: ReactNode;
    /** Small-print legal note shown at the bottom of the form, per brand design. */
    legalNode?: ReactNode;
    /** Subtitle shown under the title, per brand design. */
    subtitleNode?: ReactNode;
};

export default function Template(props: QhTemplateProps) {
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
        legalNode = null,
        subtitleNode = null,
    } = props;

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });
    const { msg, msgStr, currentLanguage } = i18n;
    const { auth, url, message, isAppInitiatedAction } = kcContext;

    useEffect(() => {
        document.title = documentTitle ?? msgStr("loginTitle", kcContext.realm.displayName);
    }, [documentTitle, kcContext.realm.displayName, msgStr]);

    // Override Keycloak's default favicon with the QHaul "Q" mark.
    useEffect(() => {
        let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
        if (link === null) {
            link = document.createElement("link");
            link.rel = "icon";
            document.head.appendChild(link);
        }
        link.type = "image/png";
        link.href = faviconUrl;
    }, []);

    useSetClassName({ qualifiedName: "html", className: kcClsx("kcHtmlClass") });
    useSetClassName({
        qualifiedName: "body",
        className: bodyClassName ?? kcClsx("kcBodyClass"),
    });

    const { isReadyToRender } = useInitialize({ kcContext, doUseDefaultCss });
    if (!isReadyToRender) return null;

    const isSplit = layoutVariant === "split";

    /* ── Title block (shared between layouts) ── */
    const titleBlock = (() => {
        if (auth !== undefined && auth.showUsername && !auth.showResetCredentials) {
            return (
                <div className="flex items-center justify-between mb-2">
                    <span
                        id="kc-attempted-username"
                        style={{ fontSize: "1rem", fontWeight: 700, color: "var(--qh-text)" }}
                    >
                        {auth.attemptedUsername}
                    </span>
                    <a
                        id="reset-login"
                        href={url.loginRestartFlowUrl}
                        aria-label={msgStr("restartLoginTooltip")}
                        style={{ fontSize: "0.75rem", color: "var(--qh-accent)" }}
                    >
                        {msg("restartLoginTooltip")}
                    </a>
                </div>
            );
        }

        const titleNode = (
            <h2
                id="kc-page-title"
                style={{
                    margin: "0 0 6px",
                    fontSize: isSplit ? "30px" : "1.5rem",
                    fontWeight: 700,
                    color: "var(--qh-text)",
                    letterSpacing: "-0.01em",
                    lineHeight: 1.15,
                }}
            >
                {headerNode}
            </h2>
        );

        if (displayRequiredFields) {
            return (
                <div className="flex items-start justify-between">
                    {titleNode}
                    <span style={{ fontSize: "0.75rem", color: "var(--qh-muted)" }}>
                        <span style={{ color: "var(--qh-error)" }}>*</span> {msg("requiredFields")}
                    </span>
                </div>
            );
        }

        return titleNode;
    })();

    /* ── Shared body content: message, page content, social, misc links ── */
    const bodyContent = (
        <>
            {displayMessage && message !== undefined && (
                <div style={{ marginBottom: "18px" }}>
                    <QhAlert
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
                        <span dangerouslySetInnerHTML={{ __html: kcSanitize(message.summary) }} />
                    </QhAlert>
                </div>
            )}

            {children as ReactNode}

            {socialProvidersNode && (
                <div id="qh-social" style={{ marginTop: "20px" }}>
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
                            color: "var(--qh-accent)",
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
                        marginTop: "18px",
                        paddingTop: "16px",
                        borderTop: "1px solid var(--qh-border)",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        flexWrap: "wrap",
                        fontSize: "14px",
                        color: "var(--qh-muted)",
                    }}
                >
                    {infoNode}
                </div>
            )}

            {isAppInitiatedAction && (
                <div className="mt-4 text-center">
                    <a href={url.loginRestartFlowUrl} style={{ fontSize: "0.8rem", color: "var(--qh-muted)" }}>
                        {msg("doCancel")}
                    </a>
                </div>
            )}

            {legalNode && (
                <div style={{ marginTop: "18px", fontSize: "12px", lineHeight: 1.6, color: "var(--qh-muted-2)", maxWidth: "46ch" }}>
                    {legalNode}
                </div>
            )}
        </>
    );

    /* ── Split layout: exact two-column brand design (aside | pane) ── */
    if (isSplit) {
        return (
            <div id="qh-root" lang={currentLanguage.languageTag} className="qh-split-root">
                <aside className="qh-split-brand">{leftPanelNode}</aside>

                <main id="qh-pane" className="qh-split-pane">
                    <div className="flex items-center justify-between gap-3 mb-5">
                        <span
                            style={{
                                fontSize: "11px",
                                fontWeight: 700,
                                letterSpacing: "0.12em",
                                textTransform: "uppercase",
                                color: "var(--qh-muted)",
                            }}
                        >
                            qhaul.ca
                        </span>
                        <LocaleMenu i18n={i18n} />
                    </div>

                    <div style={{ marginBottom: "18px" }}>
                        {titleBlock}
                        {subtitleNode && (
                            <p style={{ margin: "0", fontSize: "15px", lineHeight: 1.5, color: "var(--qh-muted)", maxWidth: "42ch" }}>
                                {subtitleNode}
                            </p>
                        )}
                    </div>

                    {bodyContent}
                </main>
            </div>
        );
    }

    /* ── Standard layout: centered card for all other login-flow pages ── */
    return (
        <div id="qh-root" lang={currentLanguage.languageTag} className="qh-standard-root">
            <div className="qh-standard-wrap">
                <div className="flex items-center justify-between gap-3 mb-4" style={{ width: "100%", maxWidth: "420px" }}>
                    <div className="flex items-center gap-2">
                        <QHaulBrandMark size={24} />
                        <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--qh-text)" }}>QHaul</span>
                    </div>
                    <LocaleMenu i18n={i18n} />
                </div>

                <div
                    id="qh-login-card"
                    style={{
                        width: "100%",
                        maxWidth: "420px",
                        background: "var(--qh-surface)",
                        border: "1px solid var(--qh-border)",
                        borderTop: "3px solid var(--qh-accent)",
                        borderRadius: "var(--qh-r-sm)",
                        padding: "28px",
                    }}
                >
                    <div style={{ marginBottom: "16px" }}>
                        {titleBlock}
                        {subtitleNode && (
                            <p style={{ margin: "6px 0 0", fontSize: "14px", lineHeight: 1.5, color: "var(--qh-muted)" }}>
                                {subtitleNode}
                            </p>
                        )}
                    </div>
                    {bodyContent}
                </div>
            </div>
        </div>
    );
}
