import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import { CqButton } from "@keycloak-theme/shared/ui";

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
            <p style={{ color: "var(--cq-text-2)", fontSize: "0.875rem", marginBottom: "20px", lineHeight: 1.6 }}>
                {msg("pageExpiredMsg1")}{" "}
                <a href={url.loginRestartFlowUrl} style={{ color: "var(--cq-accent)" }}>
                    {msg("doClickHere")}
                </a>
                {" "}{msg("pageExpiredMsg2")}{" "}
                <a href={url.loginAction} style={{ color: "var(--cq-accent)" }}>
                    {msg("doClickHere")}
                </a>
                {"."}
            </p>
            <CqButton variant="primary" size="md" onClick={() => { window.location.href = url.loginRestartFlowUrl; }}>
                {msg("doTryAgain")}
            </CqButton>
        </Template>
    );
}
