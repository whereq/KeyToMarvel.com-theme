import { useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { KcContext } from "@keycloak-theme/login/KcContext";
import type { I18n } from "@keycloak-theme/login/i18n";
import LoginForm from "@keycloak-theme/login/pages/login/LoginForm";
import RegistrationInfo from "@keycloak-theme/login/pages/login/RegistrationInfo";
import SocialProviders from "@keycloak-theme/login/pages/login/SocialProviders";

export default function Login(props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { realm, messagesPerField } = kcContext;
    const { msg } = i18n;

    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!messagesPerField.existsError("username", "password")}
            headerNode={msg("loginAccountTitle")}
            displayInfo={realm.password && realm.registrationAllowed && !kcContext.registrationDisabled}
            infoNode={<RegistrationInfo kcContext={kcContext} i18n={i18n} />}
            socialProvidersNode={<SocialProviders kcContext={kcContext} i18n={i18n} kcClsx={kcClsx} />}
        >
            <LoginForm 
                kcContext={kcContext} 
                i18n={i18n} 
                kcClsx={kcClsx}
                isLoginButtonDisabled={isLoginButtonDisabled}
                setIsLoginButtonDisabled={setIsLoginButtonDisabled}
            />
        </Template>
    );
}