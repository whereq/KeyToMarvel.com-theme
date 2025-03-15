import type { I18n } from "../../i18n";
import type { KcContext } from "../../KcContext";
import PasswordWrapper from "./PasswordWrapper";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { PageProps } from "keycloakify/login/pages/PageProps";
import { useState } from "react";

export default function LoginForm(props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) {
    const { kcContext, i18n } = props;

    const { realm, url, usernameHidden, login, auth, messagesPerField } = kcContext;
    const { msg, msgStr } = i18n;

    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);

    return (
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
                            className="text-red-400 text-sm mt-1"
                            aria-live="polite"
                            dangerouslySetInnerHTML={{
                                __html: kcSanitize(messagesPerField.getFirstError("username", "password"))
                            }}
                        />
                    )}
                </div>
            )}

            <div className="mb-4">
                <PasswordWrapper i18n={i18n} passwordInputId="password">
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
                        className="text-red-400 text-sm mt-1"
                        aria-live="polite"
                        dangerouslySetInnerHTML={{
                            __html: kcSanitize(messagesPerField.getFirstError("username", "password"))
                        }}
                    />
                )}
            </div>

            <div className="mb-4 flex justify-between items-center">
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
                {realm.resetPasswordAllowed && (
                    <div>
                        <a tabIndex={6} href={url.loginResetCredentialsUrl} className="text-blue-400 hover:text-blue-300">
                            {msg("doForgotPassword")}
                        </a>
                    </div>
                )}
            </div>

            <div id="kc-form-buttons" className="mt-6">
                <input type="hidden" id="id-hidden-input" name="credentialId" value={auth.selectedCredential ?? ""} />
                <button
                    tabIndex={7}
                    disabled={isLoginButtonDisabled}
                    className="w-full px-4 py-2 text-orange-400 bg-blue-600 rounded-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    name="login"
                    id="kc-login"
                    type="submit"
                >
                    {msgStr("doLogIn")}
                </button>
            </div>
        </form>
    );
}