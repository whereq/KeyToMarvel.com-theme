import { useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import { VgButton, VgInput, VgFormField } from "@keycloak-theme/shared/ui";

export default function LoginConfigTotp(
    props: PageProps<Extract<KcContext, { pageId: "login-config-totp.ftl" }>, I18n>,
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { url, isAppInitiatedAction, totp, mode, messagesPerField } = kcContext;
    const { msg, msgStr, advancedMsg, advancedMsgStr } = i18n;

    const [disabled, setDisabled] = useState(false);
    const otpError = messagesPerField.existsError("totp");
    const userLabelError = messagesPerField.existsError("userLabel");

    const algToLabel: Record<string, string> = {
        HmacSHA1: "SHA1",
        HmacSHA256: "SHA256",
        HmacSHA512: "SHA512",
    };

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msg("loginTotpTitle")}
        >
            <div className="flex flex-col gap-5">
                {/* Step 1: Install app */}
                <section>
                    <h2 style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--vg-text-muted)", marginBottom: "10px" }}>
                        {msg("loginTotpStep1")}
                    </h2>
                    <ul className="flex flex-col gap-1.5">
                        {totp.supportedApplications.map(app => (
                            <li key={app} style={{ fontSize: "0.875rem", color: "var(--vg-text-secondary)" }}>
                                • {advancedMsg(app)}
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Step 2: Scan QR or enter secret */}
                <section>
                    <h2 style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--vg-text-muted)", marginBottom: "10px" }}>
                        {mode === "manual" ? msg("loginTotpManualStep2") : msg("loginTotpStep2")}
                    </h2>
                    {mode !== "manual" ? (
                        <div className="flex flex-col items-center gap-3">
                            <img
                                id="totpSecret-qrCode"
                                src={`data:image/png;base64, ${totp.qrUrl}`}
                                alt="QR Code"
                                style={{
                                    width: 160,
                                    height: 160,
                                    padding: 8,
                                    background: "white",
                                    borderRadius: "var(--vg-radius-md)",
                                }}
                            />
                            <a href={totp.manualUrl} id="mode-manual" style={{ fontSize: "0.8rem", color: "var(--vg-cyan-400)" }}>
                                {advancedMsgStr("loginTotpManualLabel")}
                            </a>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            <code
                                id="totpSecret-manual-code"
                                style={{
                                    padding: "12px",
                                    background: "var(--vg-bg-elevated)",
                                    border: "1px solid var(--vg-border-default)",
                                    borderRadius: "var(--vg-radius-sm)",
                                    fontFamily: "var(--vg-font-mono)",
                                    fontSize: "0.875rem",
                                    color: "var(--vg-gold-400)",
                                    letterSpacing: "0.15em",
                                    wordBreak: "break-all",
                                }}
                            >
                                {totp.totpSecret}
                            </code>
                            <div style={{ fontSize: "0.75rem", color: "var(--vg-text-muted)" }}>
                                <div>{msg("loginTotpType")}: {msg(`loginTotp.${totp.policy.type}`)}</div>
                                <div>{msg("loginTotpAlgorithm")}: {algToLabel[totp.policy.algorithm] ?? totp.policy.algorithm}</div>
                                <div>{msg("loginTotpDigits")}: {totp.policy.digits}</div>
                                {totp.policy.type === "totp" && (
                                    <div>{msg("loginTotpInterval")}: {totp.policy.period}s</div>
                                )}
                                {totp.policy.type === "hotp" && (
                                    <div>{msg("loginTotpCounter")}: {totp.policy.initialCounter}</div>
                                )}
                            </div>
                            <a href={totp.qrUrl} id="mode-barcode" style={{ fontSize: "0.8rem", color: "var(--vg-cyan-400)" }}>
                                {msg("loginTotpScanBarcode")}
                            </a>
                        </div>
                    )}
                </section>

                {/* Step 3: Enter OTP */}
                <section>
                    <h2 style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--vg-text-muted)", marginBottom: "10px" }}>
                        {msg("loginTotpStep3")}
                    </h2>
                    <form
                        action={url.loginAction}
                        method="post"
                        onSubmit={() => { setDisabled(true); return true; }}
                        className="flex flex-col gap-4"
                    >
                        <input type="hidden" id="totpSecret" name="totpSecret" value={totp.totpSecret} />
                        {mode && <input type="hidden" id="mode" value={mode} />}

                        <VgFormField
                            id="totp"
                            label={msg("authenticatorCode")}
                            error={
                                otpError ? (
                                    <span dangerouslySetInnerHTML={{ __html: kcSanitize(messagesPerField.getFirstError("totp")) }} />
                                ) : undefined
                            }
                        >
                            <VgInput
                                tabIndex={2}
                                id="totp"
                                name="totp"
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                autoComplete="one-time-code"
                                hasError={otpError}
                                style={{ letterSpacing: "0.4em", fontSize: "1.25rem", textAlign: "center", fontFamily: "var(--vg-font-mono)" }}
                            />
                        </VgFormField>

                        <VgFormField
                            id="userLabel"
                            label={msg("loginTotpDeviceName")}
                            error={
                                userLabelError ? (
                                    <span dangerouslySetInnerHTML={{ __html: kcSanitize(messagesPerField.getFirstError("userLabel")) }} />
                                ) : undefined
                            }
                        >
                            <VgInput tabIndex={3} id="userLabel" name="userLabel" type="text" autoComplete="off" hasError={userLabelError} />
                        </VgFormField>

                        <div className="flex items-center justify-between gap-4 mt-2">
                            {isAppInitiatedAction && (
                                <VgButton variant="ghost" size="md" type="submit" name="cancel-aia" value="true">
                                    {msgStr("doCancel")}
                                </VgButton>
                            )}
                            <VgButton variant="frontend" size="md" fullWidth={!isAppInitiatedAction} disabled={disabled} type="submit">
                                {msgStr("doSubmit")}
                            </VgButton>
                        </div>
                    </form>
                </section>
            </div>
        </Template>
    );
}
