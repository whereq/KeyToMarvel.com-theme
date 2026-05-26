import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import { CbButton } from "@keycloak-theme/shared/ui";
import TermsText from "./TermsText";

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
        >
            <div
                style={{
                    maxHeight: "320px",
                    overflowY: "auto",
                    padding: "16px",
                    marginBottom: "20px",
                    background: "var(--cb-bg-elevated)",
                    border: "1px solid var(--cb-border-default)",
                    borderRadius: "var(--cb-radius-sm)",
                }}
            >
                <TermsText />
            </div>

            <form action={url.loginAction} method="post" className="flex gap-3">
                <CbButton variant="secondary" size="md" fullWidth type="submit" name="cancel" value="cancel">
                    {msgStr("doDecline")}
                </CbButton>
                <CbButton variant="primary" size="md" fullWidth type="submit" name="accept" value="accept">
                    {msgStr("doAccept")}
                </CbButton>
            </form>
        </Template>
    );
}
