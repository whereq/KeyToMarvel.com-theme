import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { FiAlertTriangle } from "react-icons/fi";

export default function Error(
    props: PageProps<Extract<KcContext, { pageId: "error.ftl" }>, I18n>,
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { message, client } = kcContext;
    const { msg } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msg("errorTitle")}
            displayMessage={false}
        >
            <div className="flex flex-col items-center gap-5 text-center py-4">
                <div
                    style={{
                        width: "56px",
                        height: "56px",
                        background: "var(--fd-error-bg)",
                        border: "1px solid var(--fd-error-border)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--fd-error)",
                    }}
                >
                    <FiAlertTriangle size={24} />
                </div>

                <p
                    style={{ fontSize: "0.9rem", color: "var(--fd-text-secondary)", lineHeight: 1.6, margin: 0 }}
                    dangerouslySetInnerHTML={{ __html: kcSanitize(message?.summary ?? "") }}
                />

                {client?.baseUrl && (
                    <a href={client.baseUrl} style={{ fontSize: "0.85rem", color: "var(--fd-blue-500)" }}>
                        {msg("backToApplication")}
                    </a>
                )}
            </div>
        </Template>
    );
}
