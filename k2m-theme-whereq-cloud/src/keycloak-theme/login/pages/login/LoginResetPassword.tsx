import { useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import type { WqcTemplateProps } from "@keycloak-theme/layout/Template";
import WqcBrandPanel from "@keycloak-theme/layout/WqcBrandPanel";
import { WqcButton, WqcInput, WqcFormField } from "@keycloak-theme/shared/ui";

type MsgKey = Parameters<I18n["msgStr"]>[0];

export default function LoginResetPassword(
    props: PageProps<Extract<KcContext, { pageId: "login-reset-password.ftl" }>, I18n>,
) {
    const { kcContext, i18n, doUseDefaultCss, classes } = props;
    const { realm, url, messagesPerField } = kcContext;
    const { msg, msgStr } = i18n;

    const [disabled, setDisabled] = useState(false);
    const hasError = messagesPerField.existsError("username");

    const Template = props.Template as React.ComponentType<WqcTemplateProps>;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msgStr("forgotFormTitle" as MsgKey)}
            subtitleNode={msgStr("forgotFormSub" as MsgKey)}
            displayMessage={!hasError}
            displayInfo
            infoNode={
                <>
                    <span>{msgStr("forgotAltPrompt" as MsgKey)}</span>
                    <a href={url.loginUrl} style={{ color: "var(--wqc-accent)", fontWeight: 700 }}>
                        {msgStr("forgotAltCta" as MsgKey)}
                    </a>
                </>
            }
            legalNode={msgStr("forgotLegalNote" as MsgKey)}
            layoutVariant="split"
            leftPanelNode={<WqcBrandPanel i18n={i18n} />}
        >
            <form
                id="kc-reset-password-form"
                onSubmit={() => { setDisabled(true); return true; }}
                action={url.loginAction}
                method="post"
                className="flex flex-col gap-4"
            >
                <WqcFormField
                    id="username"
                    label={
                        !realm.loginWithEmailAllowed
                            ? msg("username")
                            : !realm.registrationEmailAsUsername
                                ? msg("usernameOrEmail")
                                : msg("email")
                    }
                    error={
                        hasError ? (
                            <span dangerouslySetInnerHTML={{ __html: kcSanitize(messagesPerField.getFirstError("username")) }} />
                        ) : undefined
                    }
                >
                    <WqcInput
                        tabIndex={2}
                        id="username"
                        name="username"
                        type="text"
                        autoFocus
                        autoComplete="username"
                        hasError={hasError}
                    />
                </WqcFormField>

                <WqcButton variant="primary" size="lg" fullWidth disabled={disabled} type="submit" className="mt-2">
                    {msgStr("doSubmit")}
                </WqcButton>
            </form>
        </Template>
    );
}
