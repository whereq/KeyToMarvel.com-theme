import { useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import { FdButton, FdInput, FdFormField } from "@keycloak-theme/shared/ui";

export default function LoginOtp(
    props: PageProps<Extract<KcContext, { pageId: "login-otp.ftl" }>, I18n>,
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { url, otpLogin, messagesPerField } = kcContext;
    const { msg, msgStr, advancedMsg } = i18n;

    const [disabled, setDisabled] = useState(false);
    const hasError = messagesPerField.existsError("totp");

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msg("doLogIn")}
            displayMessage={!hasError}
        >
            <p style={{ fontSize: "0.85rem", color: "var(--fd-text-secondary)", marginBottom: "16px", lineHeight: 1.6 }}>
                {advancedMsg("loginTotpDescription")}
            </p>

            <form
                id="kc-otp-login-form"
                onSubmit={() => { setDisabled(true); return true; }}
                action={url.loginAction}
                method="post"
                className="flex flex-col gap-4"
            >
                {/* Credential selector */}
                {otpLogin.userOtpCredentials.length > 1 && (
                    <FdFormField id="selectedCredentialId" label={msg("loginChooseAuthenticator")}>
                        <select
                            id="selectedCredentialId"
                            name="selectedCredentialId"
                            style={{
                                width: "100%",
                                padding: "10px 12px",
                                background: "var(--fd-bg-elevated)",
                                color: "var(--fd-text-primary)",
                                border: "1px solid var(--fd-border-default)",
                                fontSize: "0.875rem",
                            }}
                        >
                            {otpLogin.userOtpCredentials.map(c => (
                                <option
                                    key={c.id}
                                    value={c.id}
                                    selected={c.id === otpLogin.selectedCredentialId}
                                >
                                    {c.userLabel}
                                </option>
                            ))}
                        </select>
                    </FdFormField>
                )}

                <FdFormField
                    id="otp"
                    label={msg("loginOtpOneTime")}
                    error={
                        hasError ? (
                            <span dangerouslySetInnerHTML={{ __html: kcSanitize(messagesPerField.getFirstError("totp")) }} />
                        ) : undefined
                    }
                >
                    <FdInput
                        tabIndex={2}
                        id="otp"
                        name="otp"
                        type="text"
                        autoFocus
                        autoComplete="one-time-code"
                        inputMode="numeric"
                        hasError={hasError}
                        style={{ letterSpacing: "0.2em", fontFamily: "var(--fd-font-mono)" }}
                    />
                </FdFormField>

                <FdButton variant="primary" size="lg" fullWidth disabled={disabled} type="submit">
                    {msgStr("doLogIn")}
                </FdButton>
            </form>
        </Template>
    );
}
