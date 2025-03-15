import { useEffect } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import { useInitialize } from "keycloakify/login/Template.useInitialize";

import { PiYinYangFill } from "react-icons/pi";

import type { I18n } from "./i18n";
import type { KcContext } from "./KcContext";

import "./template.css"; // Import the CSS file

export default function Template(props: TemplateProps<KcContext, I18n>) {
    const {
        displayMessage = true,
        displayRequiredFields = false,
        headerNode,
        socialProvidersNode = null,
        infoNode = null,
        documentTitle,
        kcContext,
        i18n,
        children
    } = props;

    const { msg, msgStr, currentLanguage, enabledLanguages } = i18n;

    const { realm, auth, url, message, isAppInitiatedAction } = kcContext;

    useEffect(() => {
        document.title = documentTitle ?? msgStr("loginTitle", kcContext.realm.displayName);
    }, [documentTitle, kcContext.realm.displayName, msgStr]);

    const { isReadyToRender } = useInitialize({ kcContext, doUseDefaultCss: false });

    if (!isReadyToRender) {
        console.log(displayRequiredFields);
        console.log(currentLanguage);
        return null;
    }

    return (
        <div id="template-full" className="h-screen flex flex-col overflow-hidden bg-gray-700">
            {/* Header */}
            <div id="kc-header" className="bg-blue-700 h-[3.125rem] flex items-center px-4 fixed top-0 left-0 right-0 z-50 w-full">
                <div id="kc-header-wrapper" className="flex items-center h-full">
                    <PiYinYangFill size={36} color="orange" className="mr-2" />
                    <span className="text-orange-400 font-bold">{msg("loginTitleHtml", realm.displayNameHtml)}</span>
                </div>
            </div>

            {/* Main Content */}
            <div id="template-main-content" className="flex-grow mt-[3.125rem] mb-[3.125rem] bg-gray-700 border-b border-orange-700">
                {/* Top Bar */}
                <div id="top-bar" className="w-1/4 min-w-[20rem] mx-auto flex justify-between items-center p-2">
                    {/* Page Title */}
                    <h1 id="kc-page-title" className="text-orange-400 text-lg font-bold">
                        {headerNode}
                    </h1>

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

                {/* Main Content */}
                <div id="main-content" className="w-1/4 min-w-[20rem] mx-auto">
                    <div id="kc-content-wrapper" className="text-orange-400">
                        {displayMessage && message !== undefined && (message.type !== "warning" || !isAppInitiatedAction) && (
                            <div className={`alert-${message.type}` + " ml-2 text-orange-500"}>
                                <div className="pf-c-alert__icon">
                                    {message.type === "success" && <span className="kcFeedbackSuccessIcon"></span>}
                                    {message.type === "warning" && <span className="kcFeedbackWarningIcon"></span>}
                                    {message.type === "error" && <span className="kcFeedbackErrorIcon"></span>}
                                    {message.type === "info" && <span className="kcFeedbackInfoIcon"></span>}
                                </div>
                                <span
                                    className="kcAlertTitleClass"
                                    dangerouslySetInnerHTML={{
                                        __html: kcSanitize(message.summary)
                                    }}
                                />
                            </div>
                        )}
                        {children}
                        {auth !== undefined && auth.showTryAnotherWayLink && (
                            <form id="kc-select-try-another-way-form" action={url.loginAction} method="post">
                                <div>
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
                        {infoNode}
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