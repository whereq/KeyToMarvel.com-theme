import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import { VgButton } from "@keycloak-theme/shared/ui";
import { FiShield } from "react-icons/fi";

export default function WebauthnAuthenticate(
    props: PageProps<Extract<KcContext, { pageId: "webauthn-authenticate.ftl" }>, I18n>,
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { url } = kcContext;
    const { advancedMsg, advancedMsgStr } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={advancedMsg("webauthn-login-title")}
        >
            <div className="flex flex-col items-center gap-5 py-4">
                <div
                    style={{
                        width: 64,
                        height: 64,
                        borderRadius: "var(--vg-radius-md)",
                        background: "var(--vg-frontend-bg)",
                        border: "1px solid var(--vg-cyan-400)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--vg-cyan-400)",
                    }}
                >
                    <FiShield size={32} />
                </div>

                <p style={{ color: "var(--vg-text-secondary)", textAlign: "center", fontSize: "0.9rem", lineHeight: 1.6, margin: 0 }}>
                    {advancedMsg("webauthn-login-intro")}
                </p>

                <form id="webauth" action={url.loginAction} method="post" className="w-full">
                    <input type="hidden" id="clientDataJSON" name="clientDataJSON" />
                    <input type="hidden" id="authenticatorData" name="authenticatorData" />
                    <input type="hidden" id="signature" name="signature" />
                    <input type="hidden" id="credentialId" name="credentialId" />
                    <input type="hidden" id="userHandle" name="userHandle" />
                    <input type="hidden" id="error" name="error" />
                    <VgButton
                        id="authenticateWebAuthnButton"
                        variant="frontend"
                        size="lg"
                        fullWidth
                        type="button"
                        onClick={() => {
                            // WebAuthn API call is handled by Keycloak's built-in JS
                            (document.getElementById("webauth") as HTMLFormElement).submit();
                        }}
                    >
                        {advancedMsgStr("webauthn-doAuthenticate")}
                    </VgButton>
                </form>

                <a href={url.loginRestartFlowUrl} style={{ fontSize: "0.8rem", color: "var(--vg-text-muted)" }}>
                    {advancedMsg("doTryAnotherWay")}
                </a>
            </div>
        </Template>
    );
}
