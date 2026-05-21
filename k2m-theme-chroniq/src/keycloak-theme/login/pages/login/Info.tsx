import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";

export default function Info(
    props: PageProps<Extract<KcContext, { pageId: "info.ftl" }>, I18n>,
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { advancedMsgStr, msg } = i18n;
    const { messageHeader, message, requiredActions, skipLink, pageRedirectUri, actionUri, client } = kcContext;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={false}
            headerNode={
                <span
                    dangerouslySetInnerHTML={{
                        __html: kcSanitize(messageHeader ?? message.summary),
                    }}
                />
            }
        >
            <div id="kc-info-message">
                <p
                    style={{ color: "var(--cq-text-2)", fontSize: "0.9rem", lineHeight: 1.7 }}
                    dangerouslySetInnerHTML={{
                        __html: kcSanitize(
                            (() => {
                                let html = message.summary;
                                if (requiredActions) {
                                    html += "<b>";
                                    html += requiredActions
                                        .map(a => advancedMsgStr(`requiredAction.${a}`))
                                        .join(", ");
                                    html += "</b>";
                                }
                                return html;
                            })(),
                        ),
                    }}
                />

                {!skipLink && (() => {
                    if (pageRedirectUri) {
                        return (
                            <div className="mt-5 text-center">
                                <a href={pageRedirectUri} style={{ fontSize: "0.875rem", color: "var(--cq-accent)" }}>
                                    {msg("backToApplication")}
                                </a>
                            </div>
                        );
                    }
                    if (actionUri) {
                        return (
                            <div className="mt-5 text-center">
                                <a href={actionUri} style={{ fontSize: "0.875rem", color: "var(--cq-accent)" }}>
                                    {msg("proceedWithAction")}
                                </a>
                            </div>
                        );
                    }
                    if (client.baseUrl) {
                        return (
                            <div className="mt-5 text-center">
                                <a href={client.baseUrl} style={{ fontSize: "0.875rem", color: "var(--cq-muted)" }}>
                                    {msg("backToApplication")}
                                </a>
                            </div>
                        );
                    }
                    return null;
                })()}
            </div>
        </Template>
    );
}
