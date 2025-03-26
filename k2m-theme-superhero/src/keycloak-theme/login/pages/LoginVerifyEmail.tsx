import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";

export default function LoginVerifyEmail(props: PageProps<Extract<KcContext, { pageId: "login-verify-email.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { msg } = i18n;

    const { url, user } = kcContext;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayInfo
            headerNode={msg("emailVerifyTitle")}
            infoNode={
                <div className="space-y-4 bg-gray-800 p-4 rounded-sm">
                    <div className="flex flex-col">
                        <span>{msg("emailVerifyInstruction1", user?.email ?? "")}</span>
                    </div>

                    <div className="border-t border-gray-600 my-3"></div>

                    <div className="flex flex-col">
                        <span>{msg("emailVerifyInstruction2")}</span>
                        <div className="flex items-baseline mt-1">
                            <a
                                href={url.loginAction}
                                className="text-orange-400 hover:text-orange-300 underline mt-1"
                            >
                                {msg("doClickHere")}
                            </a>
                            <span className="ml-1">{msg("emailVerifyInstruction3")}</span>
                        </div>
                    </div>
                </div>
            } 
            children={undefined}        
        >
            {/* Empty main content since we moved everything to infoNode */}
        </Template>
    );
}