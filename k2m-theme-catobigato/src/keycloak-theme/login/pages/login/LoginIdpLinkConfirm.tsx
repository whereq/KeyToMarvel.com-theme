import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import { CbButton, CbAlert } from "@keycloak-theme/shared/ui";

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
            <CbAlert type="info">
                {msg("confirmLinkIdpReviewProfile", idpAlias)}
            </CbAlert>

            <form id="kc-register-form" action={url.loginAction} method="post" className="flex flex-col gap-3 mt-5">
                <CbButton variant="primary" size="md" fullWidth type="submit" name="submitAction" value="updateProfile">
                    {msgStr("confirmLinkIdpReviewProfile")}
                </CbButton>
                <CbButton variant="secondary" size="md" fullWidth type="submit" name="submitAction" value="linkAccount">
                    {msgStr("confirmLinkIdpContinue", idpAlias)}
                </CbButton>
            </form>
        </Template>
    );
}
