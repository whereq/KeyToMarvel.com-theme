import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import { VgAlert } from "@keycloak-theme/shared/ui";

export default function Error(
    props: PageProps<Extract<KcContext, { pageId: "error.ftl" }>, I18n>,
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { message, client, skipLink } = kcContext;
    const { msg } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msg("errorTitle")}
        >
            <div id="kc-error-message" className="flex flex-col gap-4">
                {message && (
                    <VgAlert type="error">
                        <span dangerouslySetInnerHTML={{ __html: kcSanitize(message.summary) }} />
                    </VgAlert>
                )}

                {!skipLink && client.baseUrl && (
                    <div className="text-center">
                        <a
                            href={client.baseUrl}
                            style={{ fontSize: "0.875rem", color: "var(--vg-text-muted)" }}
                        >
                            {msg("backToApplication")}
                        </a>
                    </div>
                )}
            </div>
        </Template>
    );
}
