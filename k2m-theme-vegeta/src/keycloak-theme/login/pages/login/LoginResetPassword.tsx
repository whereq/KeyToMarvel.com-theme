import { useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import { VgButton, VgInput, VgFormField } from "@keycloak-theme/shared/ui";

export default function LoginResetPassword(
    props: PageProps<Extract<KcContext, { pageId: "login-reset-password.ftl" }>, I18n>,
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { realm, url, messagesPerField } = kcContext;
    const { msg, msgStr } = i18n;

    const [disabled, setDisabled] = useState(false);
    const hasError = messagesPerField.existsError("username");

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msg("emailForgotTitle")}
            displayMessage={!hasError}
        >
            <p style={{ marginBottom: "20px", fontSize: "0.875rem", color: "var(--vg-text-secondary)", lineHeight: 1.6 }}>
                {realm.duplicateEmailsAllowed ? msg("emailInstructionUsername") : msg("emailInstruction")}
            </p>

            <form
                id="kc-reset-password-form"
                onSubmit={() => { setDisabled(true); return true; }}
                action={url.loginAction}
                method="post"
                className="flex flex-col gap-4"
            >
                <VgFormField
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
                    <VgInput
                        tabIndex={2}
                        id="username"
                        name="username"
                        type="text"
                        autoFocus
                        autoComplete="username"
                        hasError={hasError}
                    />
                </VgFormField>

                <div className="flex items-center justify-between mt-2 gap-4">
                    <a href={url.loginUrl} style={{ fontSize: "0.8rem", color: "var(--vg-text-muted)" }}>
                        {msg("backToLogin")}
                    </a>
                    <VgButton variant="frontend" size="md" disabled={disabled} type="submit">
                        {msgStr("doSubmit")}
                    </VgButton>
                </div>
            </form>
        </Template>
    );
}
