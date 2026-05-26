import { useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import { CbButton, CbInput, CbFormField } from "@keycloak-theme/shared/ui";

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
                <section>
                    <h2 style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--cb-text-muted)", marginBottom: "10px" }}>
                        {msg("loginTotpStep1")}
                    </h2>
                    <ul className="flex flex-col gap-1.5">
                        {totp.supportedApplications.map(app => (
                            <li key={app} style={{ fontSize: "0.875rem", color: "var(--cb-text-secondary)" }}>
                                {advancedMsg(app)}
                            </li>
                        ))}
                    </ul>
                </section>

                <section>
                    <h2 style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--cb-text-muted)", marginBottom: "10px" }}>
                        {mode === "manual" ? msg("loginTotpManualStep2") : msg("loginTotpStep2")}
                    </h2>
                    {mode !== "manual" ? (
                        <div className="flex flex-col items-center gap-3">
                            <img
                                id="totpSecret-qrCode"
                                src={`data:image/png;base64, ${totp.qrUrl}`}
                                alt="QR Code"
                                style={{ width: 160, height: 160, padding: 8, background: "white", borderRadius: "var(--cb-radius-md)" }}
                            />
                            <a href={totp.manualUrl} id="mode-manual" style={{ fontSize: "0.8rem", color: "var(--cb-purple-500)" }}>
                                {advancedMsgStr("loginTotpManualLabel")}
                            </a>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            <code
                                id="totpSecret-manual-code"
                                style={{
                                    padding: "12px",
                                    background: "var(--cb-bg-elevated)",
                                    border: "1px solid var(--cb-border-default)",
                                    borderRadius: "var(--cb-radius-sm)",
                                    fontFamily: "var(--cb-font-mono)",
                                    fontSize: "0.875rem",
                                    color: "var(--cb-orange-400)",
                                    letterSpacing: "0.15em",
                                    wordBreak: "break-all",
                                }}
                            >
                                {totp.totpSecret}
                            </code>
                            <div style={{ fontSize: "0.75rem", color: "var(--cb-text-muted)" }}>
                                <div>{msg("loginTotpType")}: {msg(`loginTotp.${totp.policy.type}`)}</div>
                                <div>{msg("loginTotpAlgorithm")}: {algToLabel[totp.policy.algorithm] ?? totp.policy.algorithm}</div>
                                <div>{msg("loginTotpDigits")}: {totp.policy.digits}</div>
                                {totp.policy.type === "totp" && <div>{msg("loginTotpInterval")}: {totp.policy.period}s</div>}
                                {totp.policy.type === "hotp" && <div>{msg("loginTotpCounter")}: {totp.policy.initialCounter}</div>}
                            </div>
                            <a href={totp.qrUrl} id="mode-barcode" style={{ fontSize: "0.8rem", color: "var(--cb-purple-500)" }}>
                                {msg("loginTotpScanBarcode")}
                            </a>
                        </div>
                    )}
                </section>

                <section>
                    <h2 style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--cb-text-muted)", marginBottom: "10px" }}>
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

                        <CbFormField
                            id="totp"
                            label={msg("authenticatorCode")}
                            error={otpError ? <span dangerouslySetInnerHTML={{ __html: kcSanitize(messagesPerField.getFirstError("totp")) }} /> : undefined}
                        >
                            <CbInput tabIndex={2} id="totp" name="totp" type="text" inputMode="numeric" pattern="[0-9]*" autoComplete="one-time-code" hasError={otpError} style={{ letterSpacing: "0.4em", fontSize: "1.25rem", textAlign: "center", fontFamily: "var(--cb-font-mono)" }} />
                        </CbFormField>

                        <CbFormField
                            id="userLabel"
                            label={msg("loginTotpDeviceName")}
                            error={userLabelError ? <span dangerouslySetInnerHTML={{ __html: kcSanitize(messagesPerField.getFirstError("userLabel")) }} /> : undefined}
                        >
                            <CbInput tabIndex={3} id="userLabel" name="userLabel" type="text" autoComplete="off" hasError={userLabelError} />
                        </CbFormField>

                        <div className="flex items-center justify-between gap-4 mt-2">
                            {isAppInitiatedAction && (
                                <CbButton variant="ghost" size="md" type="submit" name="cancel-aia" value="true">
                                    {msgStr("doCancel")}
                                </CbButton>
                            )}
                            <CbButton variant="primary" size="md" fullWidth={!isAppInitiatedAction} disabled={disabled} type="submit">
                                {msgStr("doSubmit")}
                            </CbButton>
                        </div>
                    </form>
                </section>
            </div>
        </Template>
    );
}
