import { Suspense, lazy } from "react";
import type { ClassKey } from "keycloakify/login";
import type { KcContext } from "@keycloak-theme/layout/KcContext";
import { useI18n } from "@keycloak-theme/layout/i18n";
import DefaultPage from "keycloakify/login/DefaultPage";
import Template from "@keycloak-theme/layout/Template";

/* ── Lazy-loaded page components ── */
const UserProfileFormFields = lazy(
    () => import("@keycloak-theme/profile/UserProfileFormFields"),
);

const Login             = lazy(() => import("./pages/login/Login"));
const Register          = lazy(() => import("./pages/register/Register"));
const LoginUpdateProfile = lazy(() => import("@keycloak-theme/profile/LoginUpdateProfile"));
const IdpReviewUserProfile = lazy(() => import("./pages/idp/IdpReviewUserProfile"));
const LoginIdpLinkConfirm  = lazy(() => import("./pages/login/LoginIdpLinkConfirm"));
const LoginVerifyEmail     = lazy(() => import("./pages/login/LoginVerifyEmail"));
const LoginOtp             = lazy(() => import("./pages/otp/LoginOtp"));
const LoginConfigTotp      = lazy(() => import("./pages/otp/LoginConfigTotp"));
const LoginResetPassword   = lazy(() => import("./pages/login/LoginResetPassword"));
const LoginUpdatePassword  = lazy(() => import("./pages/login/LoginUpdatePassword"));
const LoginPassword        = lazy(() => import("./pages/login/LoginPassword"));
const LoginUsername        = lazy(() => import("./pages/login/LoginUsername"));
const LoginPageExpired     = lazy(() => import("./pages/login/LoginPageExpired"));
const LogoutConfirm        = lazy(() => import("./pages/login/LogoutConfirm"));
const DeleteAccountConfirm = lazy(() => import("./pages/login/DeleteAccountConfirm"));
const Terms                = lazy(() => import("./pages/terms/Terms"));
const Info                 = lazy(() => import("./pages/login/Info"));
const Error                = lazy(() => import("./pages/login/Error"));
const WebauthnAuthenticate = lazy(() => import("./pages/webauthn/WebauthnAuthenticate"));
const WebauthnRegister     = lazy(() => import("./pages/webauthn/WebauthnRegister"));

const doMakeUserConfirmPassword = true;

export default function KcPage(props: { kcContext: KcContext }) {
    const { kcContext } = props;
    const { i18n } = useI18n({ kcContext });

    const doUseDefaultCss = false;

    return (
        <Suspense>
            {(() => {
                switch (kcContext.pageId) {
                    /* ── Login flow ── */
                    case "login.ftl":
                        return (
                            <Login
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={doUseDefaultCss}
                            />
                        );
                    case "login-username.ftl":
                        return (
                            <LoginUsername
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={doUseDefaultCss}
                            />
                        );
                    case "login-password.ftl":
                        return (
                            <LoginPassword
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={doUseDefaultCss}
                            />
                        );
                    case "login-reset-password.ftl":
                        return (
                            <LoginResetPassword
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={doUseDefaultCss}
                            />
                        );
                    case "login-update-password.ftl":
                        return (
                            <LoginUpdatePassword
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={doUseDefaultCss}
                            />
                        );
                    case "login-verify-email.ftl":
                        return (
                            <LoginVerifyEmail
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={doUseDefaultCss}
                            />
                        );
                    case "login-page-expired.ftl":
                        return (
                            <LoginPageExpired
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={doUseDefaultCss}
                            />
                        );
                    case "login-idp-link-confirm.ftl":
                        return (
                            <LoginIdpLinkConfirm
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={doUseDefaultCss}
                            />
                        );

                    /* ── OTP / MFA ── */
                    case "login-otp.ftl":
                        return (
                            <LoginOtp
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={doUseDefaultCss}
                            />
                        );
                    case "login-config-totp.ftl":
                        return (
                            <LoginConfigTotp
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={doUseDefaultCss}
                            />
                        );

                    /* ── WebAuthn ── */
                    case "webauthn-authenticate.ftl":
                        return (
                            <WebauthnAuthenticate
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={doUseDefaultCss}
                            />
                        );
                    case "webauthn-register.ftl":
                        return (
                            <WebauthnRegister
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={doUseDefaultCss}
                            />
                        );

                    /* ── Registration ── */
                    case "register.ftl":
                        return (
                            <Register
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={doUseDefaultCss}
                                UserProfileFormFields={UserProfileFormFields}
                                doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                            />
                        );
                    case "login-update-profile.ftl":
                        return (
                            <LoginUpdateProfile
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={doUseDefaultCss}
                            />
                        );
                    case "idp-review-user-profile.ftl":
                        return (
                            <IdpReviewUserProfile
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={doUseDefaultCss}
                                UserProfileFormFields={UserProfileFormFields}
                                doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                            />
                        );

                    /* ── Lifecycle pages ── */
                    case "logout-confirm.ftl":
                        return (
                            <LogoutConfirm
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={doUseDefaultCss}
                            />
                        );
                    case "delete-account-confirm.ftl":
                        return (
                            <DeleteAccountConfirm
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={doUseDefaultCss}
                            />
                        );
                    case "terms.ftl":
                        return (
                            <Terms
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={doUseDefaultCss}
                            />
                        );
                    case "info.ftl":
                        return (
                            <Info
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={doUseDefaultCss}
                            />
                        );
                    case "error.ftl":
                        return (
                            <Error
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={doUseDefaultCss}
                            />
                        );

                    /* ── Fallback: use keycloakify default rendering ── */
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
