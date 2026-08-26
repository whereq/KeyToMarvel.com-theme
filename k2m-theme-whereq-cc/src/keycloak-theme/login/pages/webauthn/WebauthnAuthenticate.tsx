import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import { FdButton } from "@keycloak-theme/shared/ui";
import { FiKey } from "react-icons/fi";

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
            <div className="flex flex-col items-center gap-5 py-4 text-center">
                <div
                    style={{
                        width: "64px",
                        height: "64px",
                        background: "var(--fd-info-bg)",
                        border: "1px solid var(--fd-info-border)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--fd-blue-500)",
                    }}
                >
                    <FiKey size={28} />
                </div>

                <p style={{ fontSize: "0.875rem", color: "var(--fd-text-secondary)", lineHeight: 1.6, margin: 0 }}>
                    {advancedMsg("webauthn-login-intro")}
                </p>

                <form id="webauth" action={url.loginAction} method="post" className="w-full flex flex-col gap-3">
                    <input type="hidden" id="clientDataJSON" name="clientDataJSON" />
                    <input type="hidden" id="authenticatorData" name="authenticatorData" />
                    <input type="hidden" id="signature" name="signature" />
                    <input type="hidden" id="credentialId" name="credentialId" />
                    <input type="hidden" id="userHandle" name="userHandle" />
                    <input type="hidden" id="error" name="error" />

                    <FdButton variant="primary" size="lg" fullWidth id="authenticateWebAuthnButton" type="button">
                        {advancedMsgStr("webauthn-doAuthenticate")}
                    </FdButton>
                </form>
            </div>
        </Template>
    );
}
