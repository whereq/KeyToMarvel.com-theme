import { useEffect, type ReactNode } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { useSetClassName } from "keycloakify/tools/useSetClassName";
import { useInitialize } from "keycloakify/login/Template.useInitialize";
import type { I18n } from "./i18n";
import type { KcContext } from "./KcContext";
import LocaleToggle from "./LocaleToggle";
import ThemeToggle from "./ThemeToggle";
import { WqcAlert, WhereQCloudBrandMark } from "@keycloak-theme/shared/ui";
import faviconUrl from "@keycloak-theme/shared/assets/whereq-cloud-icon.png";

import "./template.css";

type MsgKey = Parameters<I18n["msgStr"]>[0];

export type WqcTemplateProps = Omit<TemplateProps<KcContext, I18n>, "headerNode"> & {
    /** Optional when hideDefaultHeader is set — the page renders its own title. */
    headerNode?: ReactNode;
    /** "split" renders the two-column brand design: aside panel left, pane right. */
    layoutVariant?: "split";
    /** Content for the left brand panel when layoutVariant="split". */
    leftPanelNode?: ReactNode;
    /** Small-print legal note shown at the bottom of the form, per brand design. */
    legalNode?: ReactNode;
    /** Subtitle shown under the title, per brand design. */
    subtitleNode?: ReactNode;
    /** When true, suppress Template's own title/subtitle block — the page
     *  renders its own header (e.g. Login's avatar + title row) as the first
     *  thing in `children`. */
    hideDefaultHeader?: boolean;
};

export default function Template(props: WqcTemplateProps) {
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
        hideDefaultHeader = false,
    } = props;

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });
    const { msg, msgStr, currentLanguage } = i18n;
    const { auth, url, message, isAppInitiatedAction } = kcContext;

    useEffect(() => {
        document.title = documentTitle ?? msgStr("loginTitle", kcContext.realm.displayName);
    }, [documentTitle, kcContext.realm.displayName, msgStr]);

    // Override Keycloak's default favicon with the whereq.cloud mark.
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

    /* ── Title block (shared between layouts, unless hideDefaultHeader) ── */
    const titleBlock = (() => {
        if (auth !== undefined && auth.showUsername && !auth.showResetCredentials) {
            return (
                <div className="flex items-center justify-between mb-2">
                    <span
                        id="kc-attempted-username"
                        style={{ fontSize: "1rem", fontWeight: 700, color: "var(--wqc-text)" }}
                    >
                        {auth.attemptedUsername}
                    </span>
                    <a
                        id="reset-login"
                        href={url.loginRestartFlowUrl}
                        aria-label={msgStr("restartLoginTooltip")}
                        style={{ fontSize: "0.75rem", color: "var(--wqc-accent)" }}
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
                    fontSize: isSplit ? "28px" : "1.5rem",
                    fontWeight: 300,
                    color: "var(--wqc-text)",
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
                    <span style={{ fontSize: "0.75rem", color: "var(--wqc-muted)" }}>
                        <span style={{ color: "var(--wqc-error)" }}>*</span> {msg("requiredFields")}
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
                    <WqcAlert
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
                    </WqcAlert>
                </div>
            )}

            {!hideDefaultHeader && (
                <div style={{ marginBottom: "18px" }}>
                    {titleBlock}
                    {subtitleNode && (
                        <p style={{ margin: "0", fontSize: "13px", color: "var(--wqc-muted)" }}>
                            {subtitleNode}
                        </p>
                    )}
                </div>
            )}

            {children as ReactNode}

            {socialProvidersNode && (
                <div id="wqc-social" style={{ marginTop: "20px" }}>
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
                            color: "var(--wqc-accent)",
                            cursor: "pointer",
                            fontSize: "0.8rem",
                            textDecoration: "underline",
                        }}
                    >
                        {msg("doTryAnotherWay")}
                    </button>
                </form>
            )}

            {((displayInfo && infoNode) || legalNode) && (
                <div
                    id="kc-info"
                    style={{
                        marginTop: "16px",
                        paddingTop: "16px",
                        borderTop: "1px solid var(--wqc-border)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                    }}
                >
                    {displayInfo && infoNode}
                    {legalNode}
                </div>
            )}

            {isAppInitiatedAction && (
                <div className="mt-4 text-center">
                    <a href={url.loginRestartFlowUrl} style={{ fontSize: "0.8rem", color: "var(--wqc-muted)" }}>
                        {msg("doCancel")}
                    </a>
                </div>
            )}
        </>
    );

    /* ── Site footer: copyright + legal links, shown on every page ── */
    const siteFooter = (
        <div
            style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "16px",
                fontSize: "12px",
                color: "var(--wqc-muted-2)",
            }}
        >
            <span>{msgStr("footerCopyright" as MsgKey)}</span>
            <a href="https://whereq.cloud/privacy">{msgStr("footerPrivacy" as MsgKey)}</a>
            <a href="https://whereq.cloud/terms">{msgStr("footerTerms" as MsgKey)}</a>
            <a href="https://whereq.cloud/docs">{msgStr("footerApiDocs" as MsgKey)}</a>
        </div>
    );

    /* ── Topbar: back link + theme/locale toggles ── */
    const topbar = (
        <div className="flex items-center justify-between gap-3">
            <a
                href="https://whereq.cloud"
                style={{ fontSize: "13px", fontWeight: 600, color: "var(--wqc-text)", whiteSpace: "nowrap" }}
            >
                {msgStr("backToSite" as MsgKey)}
            </a>
            <div className="flex gap-1.5" style={{ flex: "none" }}>
                <ThemeToggle lightLabel={msgStr("themeLight" as MsgKey)} darkLabel={msgStr("themeDark" as MsgKey)} />
                <LocaleToggle i18n={i18n} />
            </div>
        </div>
    );

    /* ── Split layout: exact two-column brand design (aside | pane) ── */
    if (isSplit) {
        return (
            <div id="wqc-root" lang={currentLanguage.languageTag} className="wqc-split-root">
                <aside className="wqc-split-brand">{leftPanelNode}</aside>

                <div className="wqc-split-pane">
                    {topbar}
                    <main id="wqc-pane-content" className="wqc-split-pane-content">
                        <div
                            id="wqc-login-card"
                            style={{
                                width: "100%",
                                maxWidth: "420px",
                                background: "var(--wqc-surface)",
                                border: "1px solid var(--wqc-border)",
                                borderTop: "4px solid var(--wqc-brand-blue)",
                                borderRadius: "var(--wqc-r-sm)",
                                padding: "32px",
                                display: "flex",
                                flexDirection: "column",
                                gap: "22px",
                            }}
                        >
                            {bodyContent}
                        </div>
                    </main>
                    {siteFooter}
                </div>
            </div>
        );
    }

    /* ── Standard layout: centered card for all other login-flow pages ── */
    return (
        <div id="wqc-root" lang={currentLanguage.languageTag} className="wqc-standard-root">
            <div className="wqc-standard-wrap">
                <div className="flex items-center justify-between gap-3 mb-4" style={{ width: "100%", maxWidth: "420px" }}>
                    <div className="flex items-center gap-2">
                        <WhereQCloudBrandMark size={24} />
                        <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--wqc-text)" }}>whereq.cloud</span>
                    </div>
                    <div className="flex gap-1.5">
                        <ThemeToggle lightLabel={msgStr("themeLight" as MsgKey)} darkLabel={msgStr("themeDark" as MsgKey)} />
                        <LocaleToggle i18n={i18n} />
                    </div>
                </div>

                <div
                    id="wqc-login-card"
                    style={{
                        width: "100%",
                        maxWidth: "420px",
                        background: "var(--wqc-surface)",
                        border: "1px solid var(--wqc-border)",
                        borderTop: "4px solid var(--wqc-brand-blue)",
                        borderRadius: "var(--wqc-r-sm)",
                        padding: "28px",
                    }}
                >
                    {bodyContent}
                </div>

                <div className="mt-6">{siteFooter}</div>
            </div>
        </div>
    );
}
