import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import { FdButton } from "@keycloak-theme/shared/ui";

export default function LoginIdpLinkConfirm(
    props: PageProps<Extract<KcContext, { pageId: "login-idp-link-confirm.ftl" }>, I18n>,
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { url, idpAlias } = kcContext;
    const { msg, msgStr } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msg("confirmLinkIdpTitle")}
        >
            <p style={{ fontSize: "0.875rem", color: "var(--fd-text-secondary)", marginBottom: "20px", lineHeight: 1.6 }}>
                {msg("confirmLinkIdpReviewProfile", idpAlias)}
            </p>
            <form action={url.loginAction} method="post" className="flex flex-col gap-3">
                <FdButton variant="primary" size="lg" fullWidth name="submitAction" value="updateProfile" type="submit">
                    {msgStr("confirmLinkIdpReviewProfile")}
                </FdButton>
                <FdButton variant="secondary" size="lg" fullWidth name="submitAction" value="linkAccount" type="submit">
                    {msgStr("confirmLinkIdpContinue", idpAlias)}
                </FdButton>
            </form>
        </Template>
    );
}
