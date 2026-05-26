import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import type { KcClsx } from "keycloakify/login/lib/kcClsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { CbButton, CbInput, CbPasswordInput, CbFormField, CbCheckbox } from "@keycloak-theme/shared/ui";

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
                    className="flex flex-col gap-4"
                >
                    {!usernameHidden && (
                        <CbFormField
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
                            <CbInput
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
                        </CbFormField>
                    )}

                    <CbFormField
                        id="password"
                        label={msg("password")}
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
                        <CbPasswordInput
                            tabIndex={3}
                            id="password"
                            name="password"
                            autoComplete="current-password"
                            hasError={usernameHidden ? usernameError : false}
                            aria-invalid={usernameHidden ? usernameError : false}
                        />
                    </CbFormField>

                    <div className="flex items-center justify-between">
                        <div id="kc-form-options">
                            {realm.rememberMe && !usernameHidden && (
                                <CbCheckbox
                                    tabIndex={5}
                                    id="rememberMe"
                                    name="rememberMe"
                                    defaultChecked={!!login.rememberMe}
                                    label={msg("rememberMe")}
                                />
                            )}
                        </div>
                        <div>
                            {realm.resetPasswordAllowed && (
                                <a
                                    tabIndex={6}
                                    href={url.loginResetCredentialsUrl}
                                    style={{
                                        fontSize: "0.8rem",
                                        color: "var(--cb-text-muted)",
                                    }}
                                    onMouseEnter={e =>
                                        ((e.target as HTMLAnchorElement).style.color =
                                            "var(--cb-purple-500)")
                                    }
                                    onMouseLeave={e =>
                                        ((e.target as HTMLAnchorElement).style.color =
                                            "var(--cb-text-muted)")
                                    }
                                >
                                    {msg("doForgotPassword")}
                                </a>
                            )}
                        </div>
                    </div>

                    <div id="kc-form-buttons" className="mt-2">
                        <input
                            type="hidden"
                            id="id-hidden-input"
                            name="credentialId"
                            value={auth.selectedCredential}
                        />
                        <CbButton
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
                        </CbButton>
                    </div>
                </form>
            )}
        </div>
    );
}
