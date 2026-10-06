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
            <div className="flex flex-col items-center gap-5 text-center py-4">
                <div
                    style={{
                        width: "56px",
                        height: "56px",
                        background: "var(--wqc-info-bg)",
                        border: "1px solid var(--wqc-info-border)",
                        borderRadius: "var(--wqc-r-sm)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--wqc-accent)",
                    }}
                >
                    <FiMail size={24} />
                </div>

                <div>
                    <p style={{ margin: "0 0 8px", color: "var(--wqc-text)", fontSize: "0.9rem", lineHeight: 1.6 }}>
                        {msg("emailVerifyInstruction1", user?.email ?? "")}
                    </p>
                    <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--wqc-muted)" }}>
                        {msg("emailVerifyInstruction2")}{" "}
                        <a href={url.loginAction} style={{ color: "var(--wqc-accent)" }}>
                            {msg("doClickHere")}
                        </a>
                        {" "}{msg("emailVerifyInstruction3")}
                    </p>
                </div>
            </div>
        </Template>
    );
}
