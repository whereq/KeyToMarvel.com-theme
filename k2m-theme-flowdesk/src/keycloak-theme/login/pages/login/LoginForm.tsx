import type { ReactNode } from "react";
import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import type { KcClsx } from "keycloakify/login/lib/kcClsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { FdInput, FdPasswordInput, FdCheckbox } from "@keycloak-theme/shared/ui";

export default function LoginForm(props: {
    kcContext: Extract<KcContext, { pageId: "login.ftl" }>;
    i18n: I18n;
    kcClsx: KcClsx;
    isLoginButtonDisabled: boolean;
    setIsLoginButtonDisabled: (value: boolean) => void;
    submitIcon?: ReactNode;
}) {
    const { kcContext, i18n, isLoginButtonDisabled, setIsLoginButtonDisabled, submitIcon } = props;
    const { realm, url, usernameHidden, login, auth, messagesPerField } = kcContext;
    const { msg, msgStr } = i18n;

    const usernameError = messagesPerField.existsError("username", "password");

    const fieldLabel: React.CSSProperties = {
        display: "block",
        marginBottom: 7,
        fontFamily: "var(--mono)",
        fontSize: "10px",
        fontWeight: 500,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "var(--text-dim)",
    };

    return (
        <div id="kc-form">
            {realm.password && (
                <form
                    id="kc-form-login"
                    onSubmit={() => { setIsLoginButtonDisabled(true); return true; }}
                    action={url.loginAction}
                    method="post"
                    style={{ display: "flex", flexDirection: "column", gap: 16 }}
                >
                    {/* Username */}
                    {!usernameHidden && (
                        <div>
                            <label htmlFor="username" style={fieldLabel}>
                                {!realm.loginWithEmailAllowed
                                    ? msgStr("username")
                                    : !realm.registrationEmailAsUsername
                                        ? msgStr("usernameOrEmail")
                                        : msgStr("email")}
                            </label>
                            <FdInput
                                tabIndex={2}
                                id="username"
                                name="username"
                                defaultValue={login.username ?? ""}
                                type="text"
                                autoFocus
                                autoComplete="username"
                                hasError={usernameError}
                                aria-invalid={usernameError}
                                placeholder="you@flowdesk.top"
                            />
                            {usernameError && (
                                <span className="kcInputErrorMessageClass">
                                    <span dangerouslySetInnerHTML={{ __html: kcSanitize(messagesPerField.getFirstError("username", "password")) }} />
                                </span>
                            )}
                        </div>
                    )}

                    {/* Password */}
                    <div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 7 }}>
                            <label htmlFor="password" style={{ ...fieldLabel, marginBottom: 0 }}>
                                {msgStr("password")}
                            </label>
                            {realm.resetPasswordAllowed && (
                                <a href={url.loginResetCredentialsUrl} style={{ fontFamily: "var(--ui)", fontSize: "11.5px", color: "var(--accent)", textDecoration: "none" }}>
                                    {msgStr("doForgotPassword")}
                                </a>
                            )}
                        </div>
                        <FdPasswordInput
                            tabIndex={3}
                            id="password"
                            name="password"
                            autoComplete="current-password"
                            hasError={usernameHidden ? usernameError : false}
                            aria-invalid={usernameHidden ? usernameError : false}
                        />
                        {usernameHidden && usernameError && (
                            <span className="kcInputErrorMessageClass">
                                <span dangerouslySetInnerHTML={{ __html: kcSanitize(messagesPerField.getFirstError("username", "password")) }} />
                            </span>
                        )}
                    </div>

                    {/* Remember me */}
                    {realm.rememberMe && !usernameHidden && (
                        <FdCheckbox
                            tabIndex={5}
                            id="rememberMe"
                            name="rememberMe"
                            defaultChecked={!!login.rememberMe}
                            label={msg("rememberMe")}
                        />
                    )}

                    {/* Submit */}
                    <div id="kc-form-buttons" style={{ marginTop: 6 }}>
                        <input type="hidden" id="id-hidden-input" name="credentialId" value={auth.selectedCredential} />
                        <button
                            tabIndex={7}
                            type="submit"
                            id="kc-login"
                            name="login"
                            disabled={isLoginButtonDisabled}
                            style={{
                                all: "unset",
                                boxSizing: "border-box",
                                width: "100%",
                                height: 48,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 8,
                                background: "var(--accent)",
                                color: "var(--accent-ink)",
                                borderRadius: 6,
                                fontWeight: 600,
                                fontSize: "13px",
                                letterSpacing: "0.06em",
                                textTransform: "uppercase",
                                cursor: isLoginButtonDisabled ? "not-allowed" : "pointer",
                                opacity: isLoginButtonDisabled ? 0.6 : 1,
                                transition: "filter .15s, transform .05s",
                            }}
                            onMouseEnter={e => { if (!isLoginButtonDisabled) (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1.07)"; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.filter = ""; }}
                            onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(1px)"; }}
                            onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = ""; }}
                        >
                            <span>{msgStr("doLogIn")}</span>
                            {submitIcon}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
