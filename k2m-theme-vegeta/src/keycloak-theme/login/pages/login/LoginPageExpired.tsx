import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import { FiClock } from "react-icons/fi";

export default function LoginPageExpired(
    props: PageProps<Extract<KcContext, { pageId: "login-page-expired.ftl" }>, I18n>,
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { url } = kcContext;
    const { msg } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msg("pageExpiredTitle")}
        >
            <div className="flex flex-col items-center gap-4 py-4 text-center">
                <div
                    style={{
                        width: 56,
                        height: 56,
                        borderRadius: "var(--vg-radius-md)",
                        background: "var(--vg-warning-bg)",
                        border: "1px solid var(--vg-warning-border)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--vg-warning)",
                    }}
                >
                    <FiClock size={28} />
                </div>

                <p style={{ color: "var(--vg-text-secondary)", fontSize: "0.9rem", lineHeight: 1.6, margin: 0 }}>
                    {msg("pageExpiredMsg1")}{" "}
                    <a id="loginRestartLink" href={url.loginRestartFlowUrl} style={{ color: "var(--vg-cyan-400)" }}>
                        {msg("doClickHere")}
                    </a>
                    {" "}{msg("pageExpiredMsg2")}{" "}
                    <a id="loginContinueLink" href={url.loginAction} style={{ color: "var(--vg-cyan-400)" }}>
                        {msg("doClickHere")}
                    </a>
                </p>
            </div>
        </Template>
    );
}
