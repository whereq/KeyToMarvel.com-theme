import { useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import { FdButton, FdPasswordInput, FdFormField } from "@keycloak-theme/shared/ui";

export default function LoginUpdatePassword(
    props: PageProps<Extract<KcContext, { pageId: "login-update-password.ftl" }>, I18n>,
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { url, messagesPerField, isAppInitiatedAction } = kcContext;
    const { msg, msgStr } = i18n;

    const [disabled, setDisabled] = useState(false);
    const pwError = messagesPerField.existsError("password");
    const confirmError = messagesPerField.existsError("password-confirm");

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msg("updatePasswordTitle")}
            displayMessage={!pwError && !confirmError}
        >
            <form
                id="kc-passwd-update-form"
                onSubmit={() => { setDisabled(true); return true; }}
                action={url.loginAction}
                method="post"
                className="flex flex-col gap-4"
            >
                {/* Hidden username for password managers */}
                <input type="text" readOnly hidden name="username" autoComplete="username" />
                <input type="password" readOnly hidden autoComplete="current-password" />

                <FdFormField
                    id="password-new"
                    label={msg("passwordNew")}
                    error={
                        pwError ? (
                            <span dangerouslySetInnerHTML={{ __html: kcSanitize(messagesPerField.getFirstError("password")) }} />
                        ) : undefined
                    }
                >
                    <FdPasswordInput
                        tabIndex={2}
                        id="password-new"
                        name="password-new"
                        autoFocus
                        autoComplete="new-password"
                        hasError={pwError}
                    />
                </FdFormField>

                <FdFormField
                    id="password-confirm"
                    label={msg("passwordConfirm")}
                    error={
                        confirmError ? (
                            <span dangerouslySetInnerHTML={{ __html: kcSanitize(messagesPerField.getFirstError("password-confirm")) }} />
                        ) : undefined
                    }
                >
                    <FdPasswordInput
                        tabIndex={3}
                        id="password-confirm"
                        name="password-confirm"
                        autoComplete="new-password"
                        hasError={confirmError}
                    />
                </FdFormField>

                <div className="flex gap-3 mt-2">
                    {isAppInitiatedAction && (
                        <FdButton variant="secondary" size="lg" name="cancel-aia" value="true" type="submit" style={{ flex: 1 }}>
                            {msgStr("doCancel")}
                        </FdButton>
                    )}
                    <FdButton
                        variant="primary"
                        size="lg"
                        fullWidth={!isAppInitiatedAction}
                        disabled={disabled}
                        type="submit"
                        style={isAppInitiatedAction ? { flex: 1 } : undefined}
                    >
                        {msgStr("doSubmit")}
                    </FdButton>
                </div>
            </form>
        </Template>
    );
}
