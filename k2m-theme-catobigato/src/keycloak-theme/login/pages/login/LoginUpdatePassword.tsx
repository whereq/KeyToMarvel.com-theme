import { useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import { CbButton, CbPasswordInput, CbFormField } from "@keycloak-theme/shared/ui";

export default function LoginUpdatePassword(
    props: PageProps<Extract<KcContext, { pageId: "login-update-password.ftl" }>, I18n>,
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { url, isAppInitiatedAction, messagesPerField } = kcContext;
    const { msg, msgStr } = i18n;

    const [disabled, setDisabled] = useState(false);
    const passwordError = messagesPerField.existsError("password");
    const confirmError = messagesPerField.existsError("password-confirm");

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!passwordError && !confirmError}
            headerNode={msg("updatePasswordTitle")}
        >
            <form
                id="kc-passwd-update-form"
                onSubmit={() => { setDisabled(true); return true; }}
                action={url.loginAction}
                method="post"
                className="flex flex-col gap-4"
            >
                <input type="hidden" id="username" name="username" value={kcContext.auth?.attemptedUsername ?? ""} autoComplete="username" />

                <CbFormField
                    id="password-new"
                    label={msg("passwordNew")}
                    error={
                        passwordError ? (
                            <span dangerouslySetInnerHTML={{ __html: kcSanitize(messagesPerField.getFirstError("password")) }} />
                        ) : undefined
                    }
                >
                    <CbPasswordInput tabIndex={2} id="password-new" name="password-new" autoFocus autoComplete="new-password" hasError={passwordError} />
                </CbFormField>

                <CbFormField
                    id="password-confirm"
                    label={msg("passwordConfirm")}
                    error={
                        confirmError ? (
                            <span dangerouslySetInnerHTML={{ __html: kcSanitize(messagesPerField.getFirstError("password-confirm")) }} />
                        ) : undefined
                    }
                >
                    <CbPasswordInput tabIndex={3} id="password-confirm" name="password-confirm" autoComplete="new-password" hasError={confirmError} />
                </CbFormField>

                <div className="flex items-center justify-between mt-2 gap-4">
                    {isAppInitiatedAction && (
                        <button
                            type="submit"
                            name="cancel-aia"
                            value="true"
                            style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.8rem", color: "var(--cb-text-muted)" }}
                        >
                            {msg("doCancel")}
                        </button>
                    )}
                    <CbButton variant="primary" size="md" fullWidth={!isAppInitiatedAction} disabled={disabled} type="submit">
                        {msgStr("doSubmit")}
                    </CbButton>
                </div>
            </form>
        </Template>
    );
}
