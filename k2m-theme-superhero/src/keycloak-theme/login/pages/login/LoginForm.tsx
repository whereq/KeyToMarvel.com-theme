import type { KcContext } from "@keycloak-theme/login/KcContext";
import type { I18n } from "@keycloak-theme/login/i18n";
import type { KcClsx } from "keycloakify/login/lib/kcClsx";
import PasswordWrapper from "@keycloak-theme/login/pages/login/PasswordWrapper";
import { kcSanitize } from "keycloakify/lib/kcSanitize";

export default function LoginForm(props: {
    kcContext: Extract<KcContext, { pageId: "login.ftl" }>;
    i18n: I18n;
    kcClsx: KcClsx;
    isLoginButtonDisabled: boolean;
    setIsLoginButtonDisabled: (value: boolean) => void;
}) {
    const { kcContext, i18n, kcClsx, isLoginButtonDisabled, setIsLoginButtonDisabled } = props;
    const { realm, url, usernameHidden, login, auth, messagesPerField } = kcContext;
    const { msg, msgStr } = i18n;

    return (
        <div id="kc-form" 
            className="bg-gray-800 p-8 rounded-sm shadow-lg font-sans">
            <div id="kc-form-wrapper">
                {realm.password && (
                    <form
                        id="kc-form-login"
                        onSubmit={() => {
                            setIsLoginButtonDisabled(true);
                            return true;
                        }}
                        action={url.loginAction}
                        method="post"
                    >
                        {!usernameHidden && (
                            <div className="mb-4">
                                <input
                                    tabIndex={2}
                                    id="username"
                                    className="w-full px-3 py-2 bg-gray-700 text-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    name="username"
                                    defaultValue={login.username ?? ""}
                                    type="text"
                                    placeholder={
                                        !realm.loginWithEmailAllowed
                                            ? msgStr("username")
                                            : !realm.registrationEmailAsUsername
                                                ? msgStr("usernameOrEmail")
                                                : msgStr("email")
                                    }
                                    autoFocus
                                    autoComplete="username"
                                    aria-invalid={messagesPerField.existsError("username", "password")}
                                />
                                {messagesPerField.existsError("username", "password") && (
                                    <span
                                        id="input-error"
                                        className={kcClsx("kcInputErrorMessageClass")}
                                        aria-live="polite"
                                        dangerouslySetInnerHTML={{
                                            __html: kcSanitize(messagesPerField.getFirstError("username", "password"))
                                        }}
                                    />
                                )}
                            </div>
                        )}

                        <div className="mb-4">
                            <PasswordWrapper kcClsx={kcClsx} i18n={i18n} passwordInputId="password">
                                <input
                                    tabIndex={3}
                                    id="password"
                                    className="w-full px-3 py-2 bg-gray-700 text-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    name="password"
                                    type="password"
                                    placeholder={msgStr("password")}
                                    autoComplete="current-password"
                                    aria-invalid={messagesPerField.existsError("username", "password")}
                                />
                            </PasswordWrapper>
                            {usernameHidden && messagesPerField.existsError("username", "password") && (
                                <span
                                    id="input-error"
                                    className={kcClsx("kcInputErrorMessageClass")}
                                    aria-live="polite"
                                    dangerouslySetInnerHTML={{
                                        __html: kcSanitize(messagesPerField.getFirstError("username", "password"))
                                    }}
                                />
                            )}
                        </div>

                        <div className="mb-4 flex justify-between items-center">
                            <div id="kc-form-options">
                                {realm.rememberMe && !usernameHidden && (
                                    <div className="checkbox">
                                        <label className="flex items-center text-orange-400">
                                            <input
                                                tabIndex={5}
                                                id="rememberMe"
                                                name="rememberMe"
                                                type="checkbox"
                                                defaultChecked={!!login.rememberMe}
                                                className="mr-2"
                                            />{" "}
                                            {msg("rememberMe")}
                                        </label>
                                    </div>
                                )}
                            </div>
                            <div>
                                {realm.resetPasswordAllowed && (
                                    <span>
                                        <a tabIndex={6} href={url.loginResetCredentialsUrl} 
                                            className="text-blue-400 hover:text-blue-300">
                                            {msg("doForgotPassword")}
                                        </a>
                                    </span>
                                )}
                            </div>
                        </div>

                        <div id="kc-form-buttons">
                            <input type="hidden" id="id-hidden-input" name="credentialId" value={auth.selectedCredential} />
                            <input
                                tabIndex={7}
                                disabled={isLoginButtonDisabled}
                                className="w-full px-4 py-2 text-orange-400 bg-blue-600 
                                           rounded-sm hover:bg-blue-700 
                                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                                           disabled:opacity-50 disabled:cursor-not-allowed"
                                name="login"
                                id="kc-login"
                                type="submit"
                                value={msgStr("doLogIn")}
                            />
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}