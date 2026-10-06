import { useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import { QhButton, QhInput, QhFormField } from "@keycloak-theme/shared/ui";
import { FiKey } from "react-icons/fi";

export default function WebauthnRegister(
    props: PageProps<Extract<KcContext, { pageId: "webauthn-register.ftl" }>, I18n>,
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { url, isAppInitiatedAction } = kcContext;
    const { advancedMsg, advancedMsgStr } = i18n;

    const [disabled, setDisabled] = useState(false);

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={advancedMsg("webauthn-register-title")}
        >
            <div className="flex flex-col gap-5">
                <div className="flex items-start gap-3">
                    <div
                        style={{
                            width: "40px",
                            height: "40px",
                            background: "var(--qh-info-bg)",
                            border: "1px solid var(--qh-info-border)",
                            borderRadius: "var(--qh-r-sm)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--qh-accent)",
                            flexShrink: 0,
                        }}
                    >
                        <FiKey size={18} />
                    </div>
                    <p style={{ fontSize: "0.875rem", color: "var(--qh-text-2)", lineHeight: 1.6, margin: 0 }}>
                        {advancedMsg("webauthn-registration-intro")}
                    </p>
                </div>

                <form id="register" action={url.loginAction} method="post" className="flex flex-col gap-4">
                    <QhFormField id="webauthnLabel" label={advancedMsg("webauthn-registration-security-key-label")}>
                        <QhInput
                            tabIndex={2}
                            id="webauthnLabel"
                            name="webauthnLabel"
                            type="text"
                            autoFocus
                        />
                    </QhFormField>

                    <input type="hidden" id="clientDataJSON" name="clientDataJSON" />
                    <input type="hidden" id="attestationObject" name="attestationObject" />
                    <input type="hidden" id="publicKeyCredentialId" name="publicKeyCredentialId" />
                    <input type="hidden" id="authenticatorLabel" name="authenticatorLabel" />
                    <input type="hidden" id="transports" name="transports" />
                    <input type="hidden" id="error" name="error" />

                    <div className="flex gap-3">
                        {isAppInitiatedAction && (
                            <QhButton
                                variant="secondary"
                                size="lg"
                                style={{ flex: 1 }}
                                name="cancel-aia"
                                value="true"
                                type="submit"
                            >
                                {advancedMsgStr("doCancel")}
                            </QhButton>
                        )}
                        <QhButton
                            variant="primary"
                            size="lg"
                            id="registerWebAuthn"
                            disabled={disabled}
                            onClick={() => setDisabled(true)}
                            type="button"
                            style={isAppInitiatedAction ? { flex: 1 } : { width: "100%" }}
                        >
                            {advancedMsgStr("doRegisterSecurityKey")}
                        </QhButton>
                    </div>
                </form>
            </div>
        </Template>
    );
}
