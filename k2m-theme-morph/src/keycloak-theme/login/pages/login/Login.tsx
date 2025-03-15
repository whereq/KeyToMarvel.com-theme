import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "@keycloak-theme/login/KcContext";
import type { I18n } from "@keycloak-theme/login/i18n";
import LoginForm from "@keycloak-theme/login/pages/login/LoginForm";
import SocialProviders from "@keycloak-theme/login/pages/login/SocialProviders";
import RegistrationInfo from "@keycloak-theme/login/pages/login/RegistrationInfo";
import { JSX } from "keycloakify/tools/JSX";

export default function Login(props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { realm, messagesPerField, registrationDisabled } = kcContext;
    const { msg } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!messagesPerField.existsError("username", "password")}
            headerNode={msg("loginAccountTitle")}
            displayInfo={realm.password && realm.registrationAllowed && !registrationDisabled}
            infoNode={<RegistrationInfo i18n={i18n} kcContext={kcContext} Template={function (): JSX.Element | null {
                throw new Error("Function not implemented.");
            }} doUseDefaultCss={false} />}
            socialProvidersNode={
                <SocialProviders
                    kcContext={kcContext}
                    i18n={i18n}
                    doUseDefaultCss={doUseDefaultCss}
                    classes={classes} Template={function (): JSX.Element | null {
                        throw new Error("Function not implemented.");
                    }} />
            }
        >
            <div id="kc-form" className="bg-gray-800 p-8 rounded-sm shadow-lg font-sans">
                <div id="kc-form-wrapper">
                    {realm.password && (
                        <LoginForm
                            kcContext={kcContext}
                            i18n={i18n}
                            doUseDefaultCss={doUseDefaultCss}
                            classes={classes} Template={function (): JSX.Element | null {
                                throw new Error("Function not implemented.");
                            }} />
                    )}
                </div>
            </div>
        </Template>
    );
}