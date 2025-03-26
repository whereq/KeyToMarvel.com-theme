import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";

export default function LoginPageExpired(props: PageProps<Extract<KcContext, { pageId: "login-page-expired.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { url } = kcContext;

    const { msg } = i18n;

    return (
        <Template kcContext={kcContext} i18n={i18n} 
            doUseDefaultCss={doUseDefaultCss} 
            classes={classes} 
            headerNode={msg("pageExpiredTitle")}>
            <div id="instruction1" className="instruction bg-gray-800 p-4 rounded-sm space-y-3">
                <div className="flex flex-col">
                    <span>{msg("pageExpiredMsg1")}</span>
                    <a 
                        id="loginRestartLink" 
                        href={url.loginRestartFlowUrl}
                        className="text-orange-400 hover:text-orange-300 underline"
                    >
                        {msg("doClickHere")}
                    </a>
                </div>

                {/* Separator div - using Tailwind's border utilities */}
                <div className="border-t border-gray-600 my-3"></div>

                <div className="flex flex-col">
                    <span>{msg("pageExpiredMsg2")}</span>
                    <a 
                        id="loginContinueLink" 
                        href={url.loginAction}
                        className="text-orange-400 hover:text-orange-300 underline"
                    >
                        {msg("doClickHere")}
                    </a>
                </div>
            </div>
        </Template>
    );
}