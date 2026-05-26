import { useState, type LazyExoticComponent, type ComponentType, Suspense } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import { CbButton } from "@keycloak-theme/shared/ui";

type Props = PageProps<Extract<KcContext, { pageId: "idp-review-user-profile.ftl" }>, I18n> & {
    UserProfileFormFields: LazyExoticComponent<ComponentType<UserProfileFormFieldsProps>>;
    doMakeUserConfirmPassword: boolean;
};

export default function IdpReviewUserProfile(props: Props) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes, UserProfileFormFields, doMakeUserConfirmPassword } = props;
    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });
    const { url } = kcContext;
    const { msg, msgStr } = i18n;

    const [isFormSubmittable, setIsFormSubmittable] = useState(false);

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msg("loginIdpReviewProfileTitle")}
        >
            <form
                id="kc-idp-review-profile-form"
                action={url.loginAction}
                method="post"
                className="flex flex-col gap-4"
            >
                <Suspense fallback={null}>
                    <UserProfileFormFields
                        kcContext={kcContext}
                        i18n={i18n}
                        kcClsx={kcClsx}
                        onIsFormSubmittableValueChange={setIsFormSubmittable}
                        doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                    />
                </Suspense>

                <div className="flex gap-3 mt-2">
                    <CbButton variant="primary" size="md" fullWidth disabled={!isFormSubmittable} type="submit">
                        {msgStr("doSubmit")}
                    </CbButton>
                </div>
            </form>
        </Template>
    );
}
