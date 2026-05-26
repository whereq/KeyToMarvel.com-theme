import { useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import { CbButton, CbPasswordInput, CbFormField } from "@keycloak-theme/shared/ui";

export default function LoginPassword(
    props: PageProps<Extract<KcContext, { pageId: "login-password.ftl" }>, I18n>,
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { realm, url, messagesPerField } = kcContext;
    const { msg, msgStr } = i18n;

    const [disabled, setDisabled] = useState(false);
    const hasError = messagesPerField.existsError("password");

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!hasError}
            headerNode={msg("doLogIn")}
        >
            <form
                id="kc-form-login"
                onSubmit={() => { setDisabled(true); return true; }}
                action={url.loginAction}
                method="post"
                className="flex flex-col gap-4"
            >
                <CbFormField
                    id="password"
                    label={msg("password")}
                    error={
                        hasError ? (
                            <span dangerouslySetInnerHTML={{ __html: kcSanitize(messagesPerField.getFirstError("password")) }} />
                        ) : undefined
                    }
                >
                    <CbPasswordInput tabIndex={2} id="password" name="password" autoFocus autoComplete="current-password" hasError={hasError} />
                </CbFormField>

                {realm.resetPasswordAllowed && (
                    <a
                        href={url.loginResetCredentialsUrl}
                        style={{ fontSize: "0.8rem", color: "var(--cb-text-muted)", textAlign: "right" }}
                    >
                        {msg("doForgotPassword")}
                    </a>
                )}

                <CbButton variant="primary" size="lg" fullWidth disabled={disabled} type="submit">
                    {msgStr("doLogIn")}
                </CbButton>
            </form>
        </Template>
    );
}
