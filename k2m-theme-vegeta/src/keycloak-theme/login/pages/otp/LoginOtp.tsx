import { useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import { VgButton, VgInput, VgFormField } from "@keycloak-theme/shared/ui";

export default function LoginOtp(
    props: PageProps<Extract<KcContext, { pageId: "login-otp.ftl" }>, I18n>,
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { url, otpLogin, messagesPerField } = kcContext;
    const { advancedMsg, msgStr } = i18n;

    const [disabled, setDisabled] = useState(false);
    const hasError = messagesPerField.existsError("totp");

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!hasError}
            headerNode={advancedMsg("loginOtpTitle")}
        >
            <form
                id="kc-otp-login-form"
                onSubmit={() => { setDisabled(true); return true; }}
                action={url.loginAction}
                method="post"
                className="flex flex-col gap-4"
            >
                {/* OTP credential selector (when multiple OTP credentials) */}
                {otpLogin.userOtpCredentials.length > 1 && (
                    <div className="flex flex-col gap-2">
                        {otpLogin.userOtpCredentials.map((otpCredential, index) => (
                            <label
                                key={otpCredential.id}
                                className="flex items-center gap-3 p-3 cursor-pointer rounded-[var(--vg-radius-sm)]"
                                style={{
                                    background: otpCredential.id === otpLogin.selectedCredentialId
                                        ? "var(--vg-frontend-bg)"
                                        : "var(--vg-bg-elevated)",
                                    border: `1px solid ${otpCredential.id === otpLogin.selectedCredentialId
                                        ? "var(--vg-cyan-400)"
                                        : "var(--vg-border-default)"}`
                                }}
                            >
                                <input
                                    type="radio"
                                    id={`kc-otp-credential-${index}`}
                                    name="selectedCredentialId"
                                    value={otpCredential.id}
                                    defaultChecked={otpCredential.id === otpLogin.selectedCredentialId}
                                    className="accent-[var(--vg-cyan-400)]"
                                />
                                <span style={{ fontSize: "0.875rem", color: "var(--vg-text-primary)" }}>
                                    {otpCredential.userLabel}
                                </span>
                            </label>
                        ))}
                    </div>
                )}

                <VgFormField
                    id="otp"
                    label={advancedMsg("loginOtpOneTime")}
                    error={
                        hasError ? (
                            <span dangerouslySetInnerHTML={{ __html: kcSanitize(messagesPerField.getFirstError("totp")) }} />
                        ) : undefined
                    }
                >
                    <VgInput
                        tabIndex={2}
                        id="otp"
                        name="otp"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        autoComplete="one-time-code"
                        autoFocus
                        hasError={hasError}
                        style={{
                            letterSpacing: "0.4em",
                            fontSize: "1.25rem",
                            textAlign: "center",
                            fontFamily: "var(--vg-font-mono)",
                        }}
                    />
                </VgFormField>

                <VgButton variant="frontend" size="lg" fullWidth disabled={disabled} type="submit">
                    {msgStr("doLogIn")}
                </VgButton>
            </form>
        </Template>
    );
}
