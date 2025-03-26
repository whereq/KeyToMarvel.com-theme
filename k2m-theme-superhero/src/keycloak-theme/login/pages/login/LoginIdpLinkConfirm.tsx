import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";

import { K2MButtonStyle } from "@/keycloak-theme/shared/k2m-ui-shared/types/k2m-types";
import { K2MButton } from "@/keycloak-theme/shared/k2m-ui-shared/buttons/K2MButton";

export default function LoginIdpLinkConfirm(props: PageProps<Extract<KcContext, { pageId: "login-idp-link-confirm.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { url, idpAlias } = kcContext;

    const { msg } = i18n;

    return (
        <Template 
            kcContext={kcContext} 
            i18n={i18n} 
            doUseDefaultCss={doUseDefaultCss} 
            classes={classes} 
            headerNode={msg("confirmLinkIdpTitle")}>

            <form id="kc-register-form" action={url.loginAction} method="post">
                <div className="bg-gray-800 p-2 rounded-sm flex gap-2">
                    <K2MButton
                        id="updateProfile"
                        type="submit"
                        styleType={K2MButtonStyle.PRIMARY}
                        className="text-sm flex-1"
                        name="submitAction"
                        value="updateProfile"
                    >
                        {msg("confirmLinkIdpReviewProfile")}
                    </K2MButton>
                    {/* <button
                        type="submit"
                        className={kcClsx("kcButtonClass", "kcButtonDefaultClass", "kcButtonBlockClass", "kcButtonLargeClass")}
                        name="submitAction"
                        id="linkAccount"
                        value="linkAccount"
                    >
                        {msg("confirmLinkIdpContinue", idpAlias)}
                    </button> */}
                    <K2MButton
                        id="linkAccount"
                        type="submit"
                        styleType={K2MButtonStyle.SECONDARY}
                        className="text-sm flex-1"
                        name="submitAction"
                        value="linkAccount"
                    >
                        {msg("confirmLinkIdpContinue", idpAlias)}
                    </K2MButton>
                </div>
            </form>
        </Template>
    );
}
