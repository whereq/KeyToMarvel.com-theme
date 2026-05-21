import { useState, type LazyExoticComponent, type ComponentType } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import { CqButton } from "@keycloak-theme/shared/ui";

type Props = PageProps<Extract<KcContext, { pageId: "login-update-profile.ftl" }>, I18n> & {
    UserProfileFormFields: LazyExoticComponent<ComponentType<UserProfileFormFieldsProps>>;
    doMakeUserConfirmPassword: boolean;
};

export default function LoginUpdateProfile(props: Props) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes, UserProfileFormFields, doMakeUserConfirmPassword } = props;
    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });
    const { url, isAppInitiatedAction } = kcContext;
    const { msg, msgStr } = i18n;

    const [isFormSubmittable, setIsFormSubmittable] = useState(false);

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msg("loginProfileTitle")}
        >
            <form action={url.loginAction} method="post" className="flex flex-col gap-4">
                <UserProfileFormFields
                    kcContext={kcContext}
                    i18n={i18n}
                    kcClsx={kcClsx}
                    onIsFormSubmittableValueChange={setIsFormSubmittable}
                    doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                />
                <div className="flex gap-3 mt-2">
                    {isAppInitiatedAction && (
                        <CqButton variant="secondary" size="lg" style={{ flex: 1 }} name="cancel-aia" value="true" type="submit">
                            {msgStr("doCancel")}
                        </CqButton>
                    )}
                    <CqButton
                        variant="primary"
                        size="lg"
                        disabled={!isFormSubmittable}
                        type="submit"
                        style={isAppInitiatedAction ? { flex: 1 } : { width: "100%" }}
                    >
                        {msgStr("doSubmit")}
                    </CqButton>
                </div>
            </form>
        </Template>
    );
}
