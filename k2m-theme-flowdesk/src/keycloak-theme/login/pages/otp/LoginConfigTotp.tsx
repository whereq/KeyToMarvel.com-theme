import { useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import { FdButton, FdInput, FdFormField } from "@keycloak-theme/shared/ui";

export default function LoginConfigTotp(
    props: PageProps<Extract<KcContext, { pageId: "login-config-totp.ftl" }>, I18n>,
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { url, totp, messagesPerField, isAppInitiatedAction } = kcContext;
    const { msg, msgStr } = i18n;

    const [disabled, setDisabled] = useState(false);
    const otpError = messagesPerField.existsError("totp");
    const userLabelError = messagesPerField.existsError("userLabel");

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msg("loginTotpTitle")}
        >
            <ol style={{ paddingLeft: "20px", margin: "0 0 20px", fontSize: "0.875rem", color: "var(--fd-text-secondary)", lineHeight: 2 }}>
                <li>
                    {msg("loginTotpStep1")}
                    <ul style={{ listStyleType: "disc", paddingLeft: "16px", fontSize: "0.8rem" }}>
                        {totp.supportedApplications.map(app => (
                            <li key={app}>{msg(`${app}Name` as Parameters<typeof msg>[0])}</li>
                        ))}
                    </ul>
                </li>
                <li>{msg("loginTotpStep2")}</li>
                <li>
                    {msg("loginTotpStep3")}
                    <div
                        style={{
                            margin: "8px 0",
                            padding: "8px 12px",
                            background: "var(--fd-bg-elevated)",
                            border: "1px solid var(--fd-border-default)",
                            fontFamily: "var(--fd-font-mono)",
                            fontSize: "0.85rem",
                            color: "var(--fd-cyan-400)",
                            wordBreak: "break-all",
                        }}
                    >
                        {totp.totpSecretEncoded}
                    </div>
                    <img
                        src={`data:image/png;base64,${totp.totpSecretQrCode}`}
                        alt="QR Code"
                        style={{ display: "block", margin: "8px 0", maxWidth: "160px" }}
                    />
                </li>
            </ol>

            <form
                id="kc-totp-settings-form"
                onSubmit={() => { setDisabled(true); return true; }}
                action={url.loginAction}
                method="post"
                className="flex flex-col gap-4"
            >
                <FdFormField
                    id="totp"
                    label={msg("authenticatorCode")}
                    error={
                        otpError ? (
                            <span dangerouslySetInnerHTML={{ __html: kcSanitize(messagesPerField.getFirstError("totp")) }} />
                        ) : undefined
                    }
                >
                    <FdInput
                        tabIndex={2}
                        id="totp"
                        name="totp"
                        type="text"
                        autoFocus
                        autoComplete="off"
                        inputMode="numeric"
                        hasError={otpError}
                        style={{ fontFamily: "var(--fd-font-mono)", letterSpacing: "0.2em" }}
                    />
                </FdFormField>

                <input type="hidden" name="totpSecret" value={totp.totpSecret} />
                <input type="hidden" name="userLabel" value={totp.policy.type} />

                <FdFormField
                    id="userLabel"
                    label={msg("loginTotpDeviceName")}
                    required={totp.otpCredentials.length >= 1}
                    error={
                        userLabelError ? (
                            <span dangerouslySetInnerHTML={{ __html: kcSanitize(messagesPerField.getFirstError("userLabel")) }} />
                        ) : undefined
                    }
                >
                    <FdInput
                        tabIndex={3}
                        id="userLabel"
                        name="userLabel"
                        type="text"
                        autoComplete="off"
                        hasError={userLabelError}
                    />
                </FdFormField>

                <div className="flex gap-3 mt-2">
                    {isAppInitiatedAction && (
                        <FdButton variant="secondary" size="lg" style={{ flex: 1 }} name="cancel-aia" value="true" type="submit">
                            {msgStr("doCancel")}
                        </FdButton>
                    )}
                    <FdButton
                        tabIndex={4}
                        variant="primary"
                        size="lg"
                        disabled={disabled}
                        type="submit"
                        style={isAppInitiatedAction ? { flex: 1 } : { width: "100%" }}
                    >
                        {msgStr("doSubmit")}
                    </FdButton>
                </div>
            </form>
        </Template>
    );
}
