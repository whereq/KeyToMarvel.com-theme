import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import type { KcClsx } from "keycloakify/login/lib/kcClsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { WqcButton, WqcInput, WqcPasswordInput, WqcFormField, WqcCheckbox } from "@keycloak-theme/shared/ui";

type MsgKey = Parameters<I18n["msgStr"]>[0];

export default function LoginForm(props: {
    kcContext: Extract<KcContext, { pageId: "login.ftl" }>;
    i18n: I18n;
    kcClsx: KcClsx;
    isLoginButtonDisabled: boolean;
    setIsLoginButtonDisabled: (value: boolean) => void;
}) {
    const { kcContext, i18n, isLoginButtonDisabled, setIsLoginButtonDisabled } = props;
    const { realm, url, usernameHidden, login, auth, messagesPerField } = kcContext;
    const { msg, msgStr } = i18n;

    const usernameError = messagesPerField.existsError("username", "password");

    return (
        <div id="kc-form">
            {realm.password && (
                <form
                    id="kc-form-login"
                    onSubmit={() => {
                        setIsLoginButtonDisabled(true);
                        return true;
                    }}
                    action={url.loginAction}
                    method="post"
                    className="flex flex-col gap-3.5"
                >
                    {!usernameHidden && (
                        <WqcFormField
                            id="username"
                            label={
                                !realm.loginWithEmailAllowed
                                    ? msg("username")
                                    : !realm.registrationEmailAsUsername
                                        ? msg("usernameOrEmail")
                                        : msg("email")
                            }
                            error={
                                usernameError ? (
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: kcSanitize(
                                                messagesPerField.getFirstError("username", "password"),
                                            ),
                                        }}
                                    />
                                ) : undefined
                            }
                        >
                            <WqcInput
                                tabIndex={2}
                                id="username"
                                name="username"
                                defaultValue={login.username ?? ""}
                                type="text"
                                autoFocus
                                autoComplete="username"
                                hasError={usernameError}
                                aria-invalid={usernameError}
                            />
                        </WqcFormField>
                    )}

                    <WqcFormField
                        id="password"
                        label={
                            <span className="flex items-center justify-between gap-2">
                                {msg("password")}
                                {realm.resetPasswordAllowed && (
                                    <a
                                        tabIndex={6}
                                        href={url.loginResetCredentialsUrl}
                                        style={{ fontWeight: 600, color: "var(--wqc-accent)" }}
                                    >
                                        {msg("doForgotPassword")}
                                    </a>
                                )}
                            </span>
                        }
                        error={
                            usernameHidden && usernameError ? (
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: kcSanitize(
                                            messagesPerField.getFirstError("username", "password"),
                                        ),
                                    }}
                                />
                            ) : undefined
                        }
                    >
                        <WqcPasswordInput
                            tabIndex={3}
                            id="password"
                            name="password"
                            autoComplete="current-password"
                            hasError={usernameHidden ? usernameError : false}
                            aria-invalid={usernameHidden ? usernameError : false}
                            showLabel={msgStr("passwordShow" as MsgKey)}
                            hideLabel={msgStr("passwordHide" as MsgKey)}
                        />
                    </WqcFormField>

                    {realm.rememberMe && !usernameHidden && (
                        <WqcCheckbox
                            tabIndex={5}
                            id="rememberMe"
                            name="rememberMe"
                            defaultChecked={!!login.rememberMe}
                            label={msg("rememberMe")}
                        />
                    )}

                    <div id="kc-form-buttons">
                        <input
                            type="hidden"
                            id="id-hidden-input"
                            name="credentialId"
                            value={auth.selectedCredential}
                        />
                        <WqcButton
                            tabIndex={7}
                            variant="primary"
                            size="lg"
                            fullWidth
                            disabled={isLoginButtonDisabled}
                            name="login"
                            id="kc-login"
                            type="submit"
                        >
                            {msgStr("doLogIn")}
                        </WqcButton>
                    </div>
                </form>
            )}
        </div>
    );
}
