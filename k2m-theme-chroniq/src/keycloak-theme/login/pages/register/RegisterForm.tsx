import type { LazyExoticComponent, ComponentType, Dispatch, SetStateAction } from "react";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import type { KcClsx } from "keycloakify/login/lib/kcClsx";
import { CqButton } from "@keycloak-theme/shared/ui";

export default function RegisterForm(props: {
    kcContext: Extract<KcContext, { pageId: "register.ftl" }>;
    i18n: I18n;
    kcClsx: KcClsx;
    UserProfileFormFields: LazyExoticComponent<ComponentType<UserProfileFormFieldsProps>>;
    doMakeUserConfirmPassword: boolean;
    isFormSubmittable: boolean;
    setIsFormSubmittable: Dispatch<SetStateAction<boolean>>;
    areTermsAccepted: boolean;
    setAreTermsAccepted: Dispatch<SetStateAction<boolean>>;
    termsAcceptanceRequired: boolean;
}) {
    const {
        kcContext,
        i18n,
        kcClsx,
        UserProfileFormFields,
        doMakeUserConfirmPassword,
        isFormSubmittable,
        setIsFormSubmittable,
        termsAcceptanceRequired,
        areTermsAccepted,
    } = props;

    const { url, recaptchaRequired, recaptchaSiteKey } = kcContext;
    const { msg, msgStr, advancedMsg } = i18n;

    const isSubmitEnabled = isFormSubmittable && (!termsAcceptanceRequired || areTermsAccepted);

    return (
        <form
            id="kc-register-form"
            action={url.registrationAction}
            method="post"
            className="flex flex-col gap-4"
        >
            <UserProfileFormFields
                kcContext={kcContext}
                i18n={i18n}
                kcClsx={kcClsx}
                onIsFormSubmittableValueChange={setIsFormSubmittable}
                doMakeUserConfirmPassword={doMakeUserConfirmPassword}
            />

            {recaptchaRequired && recaptchaSiteKey && (
                <div className="g-recaptcha mt-1" data-size="compact" data-sitekey={recaptchaSiteKey} />
            )}

            <CqButton
                variant="primary"
                size="lg"
                fullWidth
                disabled={!isSubmitEnabled}
                type="submit"
                className="mt-2"
            >
                {msgStr("doRegister")}
            </CqButton>

            <p style={{ textAlign: "center", fontSize: "0.82rem", color: "var(--cq-muted)", margin: 0 }}>
                {advancedMsg("haveAnAccount")}{" "}
                <a href={url.loginUrl} style={{ color: "var(--cq-accent)", fontWeight: 500 }}>
                    {msg("doLogIn")}
                </a>
            </p>
        </form>
    );
}
