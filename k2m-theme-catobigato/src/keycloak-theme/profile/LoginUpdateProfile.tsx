import { Suspense, lazy, useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import { CbButton } from "@keycloak-theme/shared/ui";

const UserProfileFormFields = lazy(() => import("./UserProfileFormFields"));

export default function LoginUpdateProfile(
    props: PageProps<Extract<KcContext, { pageId: "login-update-profile.ftl" }>, I18n>,
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
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
            <form
                id="kc-update-profile-form"
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
                        doMakeUserConfirmPassword={false}
                    />
                </Suspense>

                <div className="flex items-center justify-between gap-4 mt-2">
                    {isAppInitiatedAction && (
                        <CbButton
                            variant="ghost"
                            size="md"
                            type="submit"
                            name="cancel-aia"
                            value="true"
                        >
                            {msgStr("doCancel")}
                        </CbButton>
                    )}
                    <CbButton
                        variant="primary"
                        size="md"
                        fullWidth={!isAppInitiatedAction}
                        disabled={!isFormSubmittable}
                        type="submit"
                    >
                        {msgStr("doSubmit")}
                    </CbButton>
                </div>
            </form>
        </Template>
    );
}
