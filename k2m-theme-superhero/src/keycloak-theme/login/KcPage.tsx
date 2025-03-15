import { Suspense, lazy } from "react";
import type { ClassKey } from "keycloakify/login";
import type { KcContext } from "@keycloak-theme/login/KcContext";
import { useI18n } from "@keycloak-theme/login/i18n";
import DefaultPage from "keycloakify/login/DefaultPage";
import Template from "@keycloak-theme/login/Template.tsx";
const UserProfileFormFields = lazy(
    () => import("@keycloak-theme/login/UserProfileFormFields")
);

const doMakeUserConfirmPassword = true;

const Login = lazy(() => import("@keycloak-theme/login/pages/login/Login"));
const Register = lazy(() => import("@keycloak-theme/login/pages/register/Register"));
const LoginUpdateProfile = lazy(() => import("@keycloak-theme/login/pages/LoginUpdateProfile"));

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
                            doUseDefaultCss={true}
                        />
                    );
                    case "register.ftl": return (
                        <Register
                            {...{ kcContext, i18n, classes }}
                            Template={Template}
                            doUseDefaultCss={true}
                            UserProfileFormFields={UserProfileFormFields}
                            doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                        />
                    );
                    case "login-update-profile.ftl": return (
                        <LoginUpdateProfile
                            {...{ kcContext, i18n, classes }}
                            Template={Template}
                            doUseDefaultCss={true}
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
                                doUseDefaultCss={true}
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
