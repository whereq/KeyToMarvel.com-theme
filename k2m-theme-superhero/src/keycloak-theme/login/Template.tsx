import { useEffect } from "react";
import { clsx } from "keycloakify/tools/clsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { useSetClassName } from "keycloakify/tools/useSetClassName";
import { useInitialize } from "keycloakify/login/Template.useInitialize";
import type { I18n } from "./i18n";
import type { KcContext } from "./KcContext";
import { PiYinYangFill } from "react-icons/pi";

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
        children
    } = props;

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });

    const { msg, msgStr, currentLanguage, enabledLanguages } = i18n;

    const { realm, auth, url, message, isAppInitiatedAction } = kcContext;

    useEffect(() => {
        document.title = documentTitle ?? msgStr("loginTitle", kcContext.realm.displayName);
    }, [documentTitle, kcContext.realm.displayName, msgStr]);

    useSetClassName({
        qualifiedName: "html",
        className: kcClsx("kcHtmlClass")
    });

    useSetClassName({
        qualifiedName: "body",
        className: bodyClassName ?? kcClsx("kcBodyClass")
    });

    const { isReadyToRender } = useInitialize({ kcContext, doUseDefaultCss });

    if (!isReadyToRender) {
        console.log(currentLanguage);
        return null;
    }

    return (
        <div id="template-oaa" 
            className={`kcClsx("kcLoginClass") 
                        h-screen flex flex-col overflow-hidden bg-gray-700`}>

            {/* Header */}
            <div id="kc-header" 
                className={`kcClsx("kcHeaderClass") 
                           bg-blue-700 h-[3.125rem] flex items-center px-4 fixed top-0 left-0 right-0 z-50 w-full`}>
                <div id="kc-header-wrapper"
                    className={`kcClsx("kcHeaderWrapperClass")
                                 flex items-center h-full
                                 border-2 border-orange-700`}>
                    <PiYinYangFill size={36} color="orange" className="mr-2" />
                    <span className="text-orange-400 font-bold">{msg("loginTitleHtml", realm.displayNameHtml)}</span>
                </div>
            </div>

            {/* Main Content */}
            <div id="template-main"
                className={`kcClsx("kcFormCardClass")
                            flex-grow mt-[3.125rem] mb-[3.125rem] bg-gray-700 border-b border-orange-700`}>

                <div id="top-bar" className="w-1/4 min-w-[20rem] mx-auto flex justify-between items-center p-2">
                    {(() => {
                        const node = !(auth !== undefined && auth.showUsername && !auth.showResetCredentials) ? (
                            <h1 id="kc-page-title" className="text-orange-400 text-lg font-bold">{headerNode}</h1>
                        ) : (
                            <div id="kc-username" className={kcClsx("kcFormGroupClass")}>
                                <label id="kc-attempted-username">{auth.attemptedUsername}</label>
                                <a id="reset-login" href={url.loginRestartFlowUrl} aria-label={msgStr("restartLoginTooltip")}>
                                    <div className="kc-login-tooltip">
                                        <i className={kcClsx("kcResetFlowIcon")}></i>
                                        <span className="kc-tooltip-text">{msg("restartLoginTooltip")}</span>
                                    </div>
                                </a>
                            </div>
                        );

                        if (displayRequiredFields) {
                            return (
                                <div className={kcClsx("kcContentWrapperClass")}>
                                    <div className={clsx(kcClsx("kcLabelWrapperClass"), "subtitle")}>
                                        <span className="subtitle">
                                            <span className="required">*</span>
                                            {msg("requiredFields")}
                                        </span>
                                    </div>
                                    <div className="col-md-10">{node}</div>
                                </div>
                            );
                        }

                        return node;
                    })()}

                    {/* Language Selection */}
                    {enabledLanguages.length > 1 && (
                        <div id="kc-locale">
                            <div id="kc-locale-wrapper" className="flex gap-0">
                                {enabledLanguages
                                    .filter(({ languageTag }) => languageTag === "en" || languageTag === "zh-CN")
                                    .map(({ languageTag, label, href }) => (
                                        <button
                                            key={languageTag}
                                            className="ml-1 px-1 py-0 border-1 rounded-sm bg-gray-800 text-orange-400 
                                                       font-bold hover:bg-gray-300 text-normal"
                                            onClick={() => (window.location.href = href)}
                                            aria-label={label}
                                        >
                                            {languageTag === "en" ? "EN" : "CN"}
                                        </button>
                                    ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Middle */}
                <div id="kc-content" className="w-1/4 min-w-[20rem] mx-auto text-orange-400">
                    <div id="kc-content-wrapper">
                        {/* App-initiated actions should not see warning messages about the need to complete the action during login. */}
                        {displayMessage && message !== undefined && (message.type !== "warning" || !isAppInitiatedAction) && (
                            <div
                                className={clsx(
                                    `alert-${message.type}`,
                                    `kcClsx("kcAlertClass") + " ml-2 text-orange-500"`,
                                    `pf-m-${message?.type === "error" ? "danger" : message.type}`
                                )}
                            >
                                <div className="pf-c-alert__icon">
                                    {message.type === "success" && <span className={kcClsx("kcFeedbackSuccessIcon")}></span>}
                                    {message.type === "warning" && <span className={kcClsx("kcFeedbackWarningIcon")}></span>}
                                    {message.type === "error" && <span className={kcClsx("kcFeedbackErrorIcon")}></span>}
                                    {message.type === "info" && <span className={kcClsx("kcFeedbackInfoIcon")}></span>}
                                </div>
                                <span
                                    className={kcClsx("kcAlertTitleClass")}
                                    dangerouslySetInnerHTML={{
                                        __html: kcSanitize(message.summary)
                                    }}
                                />
                            </div>
                        )}
                        {children}
                        {auth !== undefined && auth.showTryAnotherWayLink && (
                            <form id="kc-select-try-another-way-form" action={url.loginAction} method="post">
                                <div className={kcClsx("kcFormGroupClass")}>
                                    <input type="hidden" name="tryAnotherWay" value="on" />
                                    <a
                                        href="#"
                                        id="try-another-way"
                                        onClick={() => {
                                            document.forms["kc-select-try-another-way-form" as never].submit();
                                            return false;
                                        }}
                                    >
                                        {msg("doTryAnotherWay")}
                                    </a>
                                </div>
                            </form>
                        )}
                        {socialProvidersNode}
                        {displayInfo && (
                            <div id="kc-info" className={kcClsx("kcSignUpClass")}>
                                <div id="kc-info-wrapper" className={kcClsx("kcInfoAreaWrapperClass")}>
                                    {infoNode}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div id="kc-footer" className="bg-blue-700 border-t border-orange-700 h-[3.125rem] flex items-center justify-center fixed bottom-0 left-0 right-0 z-50">
                <div>
                    <span className="text-orange-400">© 2025 WhereQ Inc. All rights reserved.</span>
                </div>
            </div>
        </div>
    );
}
