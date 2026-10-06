import { useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import type { WqcTemplateProps } from "@keycloak-theme/layout/Template";
import WqcBrandPanel from "@keycloak-theme/layout/WqcBrandPanel";
import { WqcDivider } from "@keycloak-theme/shared/ui";
import AvatarPicker from "./AvatarPicker";
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

    const Template = props.Template as React.ComponentType<WqcTemplateProps>;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!messagesPerField.existsError("username", "password")}
            hideDefaultHeader
            displayInfo={
                realm.password &&
                realm.registrationAllowed &&
                !kcContext.registrationDisabled
            }
            infoNode={
                <p style={{ margin: 0, fontSize: "13px", color: "var(--wqc-text-2)" }}>
                    {msgStr("loginAltPrompt" as MsgKey)}{" "}
                    <a href={kcContext.url.registrationUrl} style={{ fontWeight: 600 }}>
                        {msgStr("loginAltCta" as MsgKey)}
                    </a>
                </p>
            }
            legalNode={
                <span style={{ fontSize: "12px", color: "var(--wqc-muted-2)" }}>
                    {msgStr("loginFooterNote" as MsgKey)}
                </span>
            }
            layoutVariant="split"
            leftPanelNode={<WqcBrandPanel i18n={i18n} />}
        >
            <div className="flex items-center gap-3.5">
                <AvatarPicker title={msgStr("avatarShuffle" as MsgKey)} />
                <div className="flex flex-col gap-0.5 min-w-0">
                    <h2 style={{ margin: 0, fontSize: "26px", fontWeight: 300, color: "var(--wqc-text)" }}>
                        {msgStr("loginFormTitle" as MsgKey)}
                    </h2>
                    <span style={{ fontSize: "13px", color: "var(--wqc-muted-2)" }}>
                        {msgStr("loginFormSub" as MsgKey)}
                    </span>
                </div>
            </div>

            <LoginForm
                kcContext={kcContext}
                i18n={i18n}
                kcClsx={kcClsx}
                isLoginButtonDisabled={isLoginButtonDisabled}
                setIsLoginButtonDisabled={setIsLoginButtonDisabled}
            />

            {hasSocialProviders && realm.password && <WqcDivider>{msg("or")}</WqcDivider>}

            {hasSocialProviders && (
                <SocialProviders kcContext={kcContext} i18n={i18n} kcClsx={kcClsx} />
            )}
        </Template>
    );
}
