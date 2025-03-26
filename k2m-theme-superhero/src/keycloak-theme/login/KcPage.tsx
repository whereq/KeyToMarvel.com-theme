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
const LoginIdpLinkConfirm = lazy(() => import("./pages/login/LoginIdpLinkConfirm"));
const LoginVerifyEmail = lazy(() => import("./pages/LoginVerifyEmail"));
const Terms = lazy(() => import("./pages/terms/Terms"));
const LoginPageExpired = lazy(() => import("./pages/login/LoginPageExpired"));
const LogoutConfirm = lazy(() => import("./pages/LogoutConfirm"));
const DeleteAccountConfirm = lazy(() => import("./pages/DeleteAccountConfirm"));

const Info = lazy(() => import("./pages/Info"));
const Error = lazy(() => import("./pages/Error"));


export default function KcPage(props: { kcContext: KcContext }) {
    const { kcContext } = props;

    const { i18n } = useI18n({ kcContext });

    const doUseDefaultCss = false;

    return (
        <Suspense>
            {(() => {
                switch (kcContext.pageId) {
                    case "login.ftl": return (
                        <Login
                            {...{ kcContext, i18n, classes }}
                            Template={Template}
                            doUseDefaultCss={doUseDefaultCss}
                        />
                    );
                    case "register.ftl": return (
                        <Register
                            {...{ kcContext, i18n, classes }}
                            Template={Template}
                            doUseDefaultCss={doUseDefaultCss}
                            UserProfileFormFields={UserProfileFormFields}
                            doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                        />
                    );
                    case "login-update-profile.ftl": return (
                        <LoginUpdateProfile
                            {...{ kcContext, i18n, classes }}
                            Template={Template}
                            doUseDefaultCss={doUseDefaultCss}
                            UserProfileFormFields={UserProfileFormFields}
                            doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                        />
                    );
                    case "idp-review-user-profile.ftl": return (
                        <IdpReviewUserProfile
                            {...{ kcContext, i18n, classes }}
                            Template={Template}
                            doUseDefaultCss={doUseDefaultCss}
                            UserProfileFormFields={UserProfileFormFields}
                            doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                        />
                    );
                    case "login-idp-link-confirm.ftl": return (
                        <LoginIdpLinkConfirm
                            {...{ kcContext, i18n, classes }}
                            Template={Template}
                            doUseDefaultCss={doUseDefaultCss}
                        />
                    );
                    case "login-verify-email.ftl": return (
                        <LoginVerifyEmail
                            {...{ kcContext, i18n, classes }}
                            Template={Template}
                            doUseDefaultCss={doUseDefaultCss}
                        />
                    );
                    case "login-page-expired.ftl": return (
                        <LoginPageExpired
                            {...{ kcContext, i18n, classes }}
                            Template={Template}
                            doUseDefaultCss={doUseDefaultCss}
                        />
                    );
                    case "logout-confirm.ftl": return (
                        <LogoutConfirm
                            {...{ kcContext, i18n, classes }}
                            Template={Template}
                            doUseDefaultCss={doUseDefaultCss}
                        />
                    );
                    case "terms.ftl": return (
                        <Terms
                            {...{ kcContext, i18n, classes }}
                            Template={Template}
                            doUseDefaultCss={doUseDefaultCss}
                        />
                    );
                    case "info.ftl": return (
                        <Info
                            {...{ kcContext, i18n, classes }}
                            Template={Template}
                            doUseDefaultCss={doUseDefaultCss}
                        />
                    );
                    case "delete-account-confirm.ftl": return (
                        <DeleteAccountConfirm
                            {...{ kcContext, i18n, classes }}
                            Template={Template}
                            doUseDefaultCss={doUseDefaultCss}
                        />
                    );
                    case "error.ftl": return (
                        <Error
                            {...{ kcContext, i18n, classes }}
                            Template={Template}
                            doUseDefaultCss={doUseDefaultCss}
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
