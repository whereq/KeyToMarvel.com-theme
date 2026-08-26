import { useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import { FdButton, FdInput, FdFormField } from "@keycloak-theme/shared/ui";
import SocialProviders from "./SocialProviders";

export default function LoginUsername(
    props: PageProps<Extract<KcContext, { pageId: "login-username.ftl" }>, I18n>,
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });
    const { realm, url, login, messagesPerField } = kcContext;
    const { msg, msgStr } = i18n;

    const [disabled, setDisabled] = useState(false);
    const hasError = messagesPerField.existsError("username");

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!hasError}
            headerNode={msg("doLogIn")}
            socialProvidersNode={
                <SocialProviders
                    kcContext={kcContext as unknown as Extract<KcContext, { pageId: "login.ftl" }>}
                    i18n={i18n}
                    kcClsx={kcClsx}
                />
            }
        >
            <form
                id="kc-form-login"
                onSubmit={() => { setDisabled(true); return true; }}
                action={url.loginAction}
                method="post"
                className="flex flex-col gap-4"
            >
                <FdFormField
                    id="username"
                    label={
                        !realm.loginWithEmailAllowed
                            ? msg("username")
                            : !realm.registrationEmailAsUsername
                                ? msg("usernameOrEmail")
                                : msg("email")
                    }
                    error={
                        hasError ? (
                            <span dangerouslySetInnerHTML={{ __html: kcSanitize(messagesPerField.getFirstError("username")) }} />
                        ) : undefined
                    }
                >
                    <FdInput
                        tabIndex={2}
                        id="username"
                        name="username"
                        defaultValue={login.username ?? ""}
                        type="text"
                        autoFocus
                        autoComplete="username"
                        hasError={hasError}
                    />
                </FdFormField>

                <FdButton variant="primary" size="lg" fullWidth disabled={disabled} type="submit">
                    {msgStr("doLogIn")}
                </FdButton>
            </form>
        </Template>
    );
}
