import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import { CqButton } from "@keycloak-theme/shared/ui";

export default function Terms(
    props: PageProps<Extract<KcContext, { pageId: "terms.ftl" }>, I18n>,
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { url } = kcContext;
    const { msg, msgStr } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msg("termsTitle")}
            displayMessage={false}
        >
            <div
                id="kc-terms-text"
                style={{
                    maxHeight: "240px",
                    overflowY: "auto",
                    padding: "12px 16px",
                    background: "var(--cq-surface-2)",
                    border: "1px solid var(--cq-border)",
                    borderTop: "2px solid var(--cq-accent)",
                    borderRadius: "var(--cq-r-xs)",
                    fontSize: "0.8rem",
                    color: "var(--cq-text-2)",
                    lineHeight: 1.7,
                    marginBottom: "20px",
                }}
            >
                {msg("termsText")}
            </div>

            <form action={url.loginAction} method="post" className="flex gap-3">
                <CqButton variant="secondary" size="lg" style={{ flex: 1 }} name="cancel" value="cancel" type="submit">
                    {msgStr("doDecline")}
                </CqButton>
                <CqButton variant="primary" size="lg" style={{ flex: 2 }} name="accept" value="accept" type="submit">
                    {msgStr("doAccept")}
                </CqButton>
            </form>
        </Template>
    );
}
