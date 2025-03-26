import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import { TermsText } from "@keycloak-theme/login/pages/terms/TermsText";
import { useState } from "react";

import { K2MButtonStyle } from "@/keycloak-theme/shared/k2m-ui-shared/types/k2m-types";
import { K2MButton } from "@/keycloak-theme/shared/k2m-ui-shared/buttons/K2MButton";

export default function Terms(props: PageProps<Extract<KcContext, { pageId: "terms.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { msg, msgStr } = i18n;

    const { url } = kcContext;

    const [isTermsExpanded, setIsTermsExpanded] = useState(false);

    const toggleTerms = () => {
        setIsTermsExpanded(!isTermsExpanded);
    };

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={false}
            headerNode={msg("termsTitle")}
        >
            <div id="kc-terms-text" className="space-y-4 bg-gray-800 rounded-sm p-2">
                <TermsText
                    title={msgStr("termsTitle")}
                    isExpanded={isTermsExpanded}
                    onToggle={toggleTerms}
                />
            </div>
            <form className="form-actions flex justify-end gap-2 mt-2" 
                action={url.loginAction} method="POST">
                <K2MButton
                    styleType={K2MButtonStyle.PRIMARY}
                    name="accept"
                    id="kc-accept"
                    type="submit"
                >
                    {msgStr("doAccept")}
                </K2MButton>
                <K2MButton
                    styleType={K2MButtonStyle.SECONDARY}
                    name="cancel"
                    id="kc-decline"
                    type="submit"
                >
                    {msgStr("doDecline")}
                </K2MButton>
            </form>
            <div className="clearfix" />
        </Template>
    );
}
