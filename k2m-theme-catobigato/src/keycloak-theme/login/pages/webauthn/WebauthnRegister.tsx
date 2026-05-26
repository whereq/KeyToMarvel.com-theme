import { useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import { CbButton, CbInput, CbFormField } from "@keycloak-theme/shared/ui";
import { FiShield } from "react-icons/fi";

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
            <div className="flex flex-col items-center gap-2 mb-5">
                <div
                    style={{
                        width: 56, height: 56,
                        borderRadius: "var(--cb-radius-md)",
                        background: "var(--cb-primary-bg)",
                        border: "1px solid var(--cb-orange-400)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "var(--cb-orange-400)",
                    }}
                >
                    <FiShield size={28} />
                </div>
                <p style={{ color: "var(--cb-text-secondary)", textAlign: "center", fontSize: "0.875rem", margin: 0 }}>
                    {advancedMsg("webauthn-register-intro")}
                </p>
            </div>

            <form id="register" action={url.loginAction} method="post" className="flex flex-col gap-4">
                <input type="hidden" id="clientDataJSON" name="clientDataJSON" />
                <input type="hidden" id="attestationObject" name="attestationObject" />
                <input type="hidden" id="publicKeyCredentialId" name="publicKeyCredentialId" />
                <input type="hidden" id="authenticatorLabel" name="authenticatorLabel" />
                <input type="hidden" id="transports" name="transports" />
                <input type="hidden" id="error" name="error" />

                <CbFormField id="webauthnLabel" label={advancedMsg("webauthn-choose-authenticator-label")}>
                    <CbInput tabIndex={2} id="webauthnLabel" name="webauthnLabel" type="text" autoComplete="off" placeholder={advancedMsgStr("webauthn-choose-authenticator-label-desc")} />
                </CbFormField>

                <div className="flex items-center justify-between gap-4 mt-2">
                    {isAppInitiatedAction && (
                        <CbButton variant="ghost" size="md" type="submit" name="cancel-aia" value="true">
                            {advancedMsgStr("doCancel")}
                        </CbButton>
                    )}
                    <CbButton id="registerWebAuthn" variant="primary" size="md" fullWidth={!isAppInitiatedAction} disabled={disabled} type="button" onClick={() => { setDisabled(true); }}>
                        {advancedMsgStr("doRegisterSecurityKey")}
                    </CbButton>
                </div>
            </form>
        </Template>
    );
}
