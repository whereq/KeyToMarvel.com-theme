import { useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import type { QhTemplateProps } from "@keycloak-theme/layout/Template";
import QhBrandPanel from "@keycloak-theme/layout/QhBrandPanel";
import { QhDivider } from "@keycloak-theme/shared/ui";
import LoginForm from "./LoginForm";
import SocialProviders from "./SocialProviders";

type MsgKey = Parameters<I18n["msgStr"]>[0];

export default function Login(
    props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>,
) {
    const { kcContext, i18n, doUseDefaultCss, classes } = props;
    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });
    const { realm, messagesPerField, social } = kcContext;
    const { msg, msgStr } = i18n;

    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);
    const hasSocialProviders = (social?.providers?.length ?? 0) > 0;

    const Template = props.Template as React.ComponentType<QhTemplateProps>;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!messagesPerField.existsError("username", "password")}
            headerNode={msgStr("loginFormTitle" as MsgKey)}
            subtitleNode={msgStr("loginFormSub" as MsgKey)}
            displayInfo={
                realm.password &&
                realm.registrationAllowed &&
                !kcContext.registrationDisabled
            }
            infoNode={
                <>
                    <span>{msgStr("loginAltPrompt" as MsgKey)}</span>
                    <a
                        href={kcContext.url.registrationUrl}
                        style={{ color: "var(--qh-accent)", fontWeight: 700 }}
                    >
                        {msgStr("loginAltCta" as MsgKey)}
                    </a>
                </>
            }
            legalNode={msgStr("loginLegalNote" as MsgKey)}
            layoutVariant="split"
            leftPanelNode={<QhBrandPanel i18n={i18n} />}
        >
            {hasSocialProviders && (
                <div style={{ marginBottom: "4px" }}>
                    <SocialProviders kcContext={kcContext} i18n={i18n} kcClsx={kcClsx} prominent />
                </div>
            )}

            {hasSocialProviders && realm.password && <QhDivider>{msg("or")}</QhDivider>}

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
