import { Suspense, lazy } from "react";
import type { ClassKey } from "keycloakify/login";
import type { KcContext } from "@/keycloak-theme/layout/KcContext";
import { useI18n } from "@/keycloak-theme/layout/i18n";
import DefaultPage from "keycloakify/login/DefaultPage";
import Template from "@/keycloak-theme/layout/Template";
const UserProfileFormFields = lazy(
    () => import("@/keycloak-theme/profile/UserProfileFormFields")
);

const doMakeUserConfirmPassword = true;

const Login = lazy(() => import("@keycloak-theme/login/pages/login/Login"));
const Register = lazy(() => import("@keycloak-theme/login/pages/register/Register"));
const LoginUpdateProfile = lazy(() => import("@keycloak-theme/profile/LoginUpdateProfile"));
const IdpReviewUserProfile = lazy(() => import("@keycloak-theme/login/pages/idp/IdpReviewUserProfile"));

export default function KcPage(props: { kcContext: KcContext }) {
    const { kcContext } = props;

    const { i18n } = useI18n({ kcContext });

    return (
        <Suspense>
            {(() => {
                switch (kcContext.pageId) {
                    case "login.ftl": return (
                        <Login
                            {...{ kcContext, i18n, classes }}
                            Template={Template}
                            doUseDefaultCss={false}
                        />
                    );
                    case "register.ftl": return (
                        <Register
                            {...{ kcContext, i18n, classes }}
                            Template={Template}
                            doUseDefaultCss={false}
                            UserProfileFormFields={UserProfileFormFields}
                            doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                        />
                    );
                    case "login-update-profile.ftl": return (
                        <LoginUpdateProfile
                            {...{ kcContext, i18n, classes }}
                            Template={Template}
                            doUseDefaultCss={false}
                            UserProfileFormFields={UserProfileFormFields}
                            doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                        />
                    );
                    case "idp-review-user-profile.ftl": return (
                        <IdpReviewUserProfile
                            {...{ kcContext, i18n, classes }}
                            Template={Template}
                            doUseDefaultCss={false}
                            UserProfileFormFields={UserProfileFormFields}
                            doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                        />
                    );
                    default:
                        return (
                            <DefaultPage
                                kcContext={kcContext}
                                i18n={i18n}
                                classes={classes}
                                Template={Template}
                                doUseDefaultCss={false}
                                UserProfileFormFields={UserProfileFormFields}
                                doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                            />
                        );
                }
            })()}
        </Suspense>
    );
}

const classes = {} satisfies { [key in ClassKey]?: string };
