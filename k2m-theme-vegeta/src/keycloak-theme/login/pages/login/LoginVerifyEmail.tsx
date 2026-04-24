import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import { FiMail } from "react-icons/fi";

export default function LoginVerifyEmail(
    props: PageProps<Extract<KcContext, { pageId: "login-verify-email.ftl" }>, I18n>,
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { url, user } = kcContext;
    const { msg } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msg("emailVerifyTitle")}
        >
            <div className="flex flex-col items-center gap-4 py-4 text-center">
                <div
                    style={{
                        width: 56,
                        height: 56,
                        borderRadius: "var(--vg-radius-md)",
                        background: "var(--vg-info-bg)",
                        border: "1px solid var(--vg-info-border)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--vg-info)",
                    }}
                >
                    <FiMail size={28} />
                </div>

                <p style={{ color: "var(--vg-text-secondary)", fontSize: "0.9rem", lineHeight: 1.6, margin: 0 }}>
                    {msg("emailVerifyInstruction1", user?.email ?? "")}
                </p>
                <p style={{ color: "var(--vg-text-muted)", fontSize: "0.8rem", margin: 0 }}>
                    {msg("emailVerifyInstruction2")}
                    {" "}
                    <a href={url.loginAction} style={{ color: "var(--vg-cyan-400)" }}>
                        {msg("doClickHere")}
                    </a>
                    {" "}
                    {msg("emailVerifyInstruction3")}
                </p>
            </div>
        </Template>
    );
}
