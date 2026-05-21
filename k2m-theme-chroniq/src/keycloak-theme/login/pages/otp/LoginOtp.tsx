import { useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import { CqButton, CqInput, CqFormField } from "@keycloak-theme/shared/ui";

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
            <p style={{ fontSize: "0.85rem", color: "var(--cq-text-2)", marginBottom: "16px", lineHeight: 1.6 }}>
                {advancedMsg("loginTotpDescription")}
            </p>

            <form
                id="kc-otp-login-form"
                onSubmit={() => { setDisabled(true); return true; }}
                action={url.loginAction}
                method="post"
                className="flex flex-col gap-4"
            >
                {otpLogin.userOtpCredentials.length > 1 && (
                    <CqFormField id="selectedCredentialId" label={msg("loginChooseAuthenticator")}>
                        <select
                            id="selectedCredentialId"
                            name="selectedCredentialId"
                            style={{
                                width: "100%",
                                padding: "10px 12px",
                                background: "var(--cq-surface-2)",
                                color: "var(--cq-text)",
                                border: "1px solid var(--cq-border)",
                                borderRadius: "var(--cq-r-sm)",
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
                    </CqFormField>
                )}

                <CqFormField
                    id="otp"
                    label={msg("loginOtpOneTime")}
                    error={
                        hasError ? (
                            <span dangerouslySetInnerHTML={{ __html: kcSanitize(messagesPerField.getFirstError("totp")) }} />
                        ) : undefined
                    }
                >
                    <CqInput
                        tabIndex={2}
                        id="otp"
                        name="otp"
                        type="text"
                        autoFocus
                        autoComplete="one-time-code"
                        inputMode="numeric"
                        hasError={hasError}
                        style={{ letterSpacing: "0.2em", fontFamily: "var(--cq-font-mono)" }}
                    />
                </CqFormField>

                <CqButton variant="primary" size="lg" fullWidth disabled={disabled} type="submit">
                    {msgStr("doLogIn")}
                </CqButton>
            </form>
        </Template>
    );
}
