import { useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import LoginForm from "./LoginForm";
import SocialProviders from "./SocialProviders";

export default function Login(
    props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>,
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });
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
            displayInfo={
                realm.password &&
                realm.registrationAllowed &&
                !kcContext.registrationDisabled
            }
            infoNode={
                <span style={{ color: "var(--vg-text-secondary)" }}>
                    {msg("noAccount")}{" "}
                    <a
                        href={kcContext.url.registrationUrl}
                        style={{ color: "var(--vg-cyan-400)", fontWeight: 500 }}
                    >
                        {msg("doRegister")}
                    </a>
                </span>
            }
            socialProvidersNode={
                <SocialProviders kcContext={kcContext} i18n={i18n} kcClsx={kcClsx} />
            }
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
