import { Suspense, type LazyExoticComponent, type ComponentType } from "react";
import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import type { KcClsx } from "keycloakify/login/lib/kcClsx";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import { CbButton } from "@keycloak-theme/shared/ui";
import TermsAcceptance from "./TermsAcceptance";
import RecaptchaField from "./RecaptchaField";

export default function RegisterForm(props: {
    kcContext: Extract<KcContext, { pageId: "register.ftl" }>;
    i18n: I18n;
    kcClsx: KcClsx;
    UserProfileFormFields: LazyExoticComponent<ComponentType<UserProfileFormFieldsProps>>;
    doMakeUserConfirmPassword: boolean;
    isFormSubmittable: boolean;
    setIsFormSubmittable: (v: boolean) => void;
    areTermsAccepted: boolean;
    setAreTermsAccepted: (v: boolean) => void;
    termsAcceptanceRequired: boolean;
}) {
    const {
        kcContext, i18n, kcClsx,
        UserProfileFormFields, doMakeUserConfirmPassword,
        isFormSubmittable, setIsFormSubmittable,
        areTermsAccepted, setAreTermsAccepted,
        termsAcceptanceRequired,
    } = props;

    const { url, recaptchaRequired, recaptchaVisible, recaptchaSiteKey, recaptchaAction } = kcContext;
    const { msg, msgStr } = i18n;

    const isSubmitDisabled =
        !isFormSubmittable || (termsAcceptanceRequired && !areTermsAccepted);

    return (
        <form
            id="kc-register-form"
            action={url.registrationAction}
            method="post"
            className="flex flex-col gap-4"
        >
            <Suspense fallback={<div style={{ color: "var(--cb-text-muted)", fontSize: "0.875rem" }}>Loading...</div>}>
                <UserProfileFormFields
                    kcContext={kcContext}
                    i18n={i18n}
                    kcClsx={kcClsx}
                    onIsFormSubmittableValueChange={setIsFormSubmittable}
                    doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                />
            </Suspense>

            {termsAcceptanceRequired && (
                <TermsAcceptance
                    kcContext={kcContext}
                    i18n={i18n}
                    areTermsAccepted={areTermsAccepted}
                    setAreTermsAccepted={setAreTermsAccepted}
                />
            )}

            <RecaptchaField kcContext={kcContext} />

            <div className="flex items-center justify-between gap-4 mt-2">
                <a href={url.loginUrl} style={{ fontSize: "0.8rem", color: "var(--cb-text-muted)" }}>
                    {msg("backToLogin")}
                </a>
                {recaptchaRequired && !recaptchaVisible && recaptchaAction !== undefined ? (
                    <CbButton
                        variant="primary"
                        size="md"
                        name="register"
                        data-sitekey={recaptchaSiteKey}
                        data-callback={() => {
                            (document.getElementById("kc-register-form") as HTMLFormElement).submit();
                        }}
                        data-action={recaptchaAction}
                        type="submit"
                    >
                        {msgStr("doRegister")}
                    </CbButton>
                ) : (
                    <CbButton
                        variant="primary"
                        size="md"
                        name="register"
                        disabled={isSubmitDisabled}
                        type="submit"
                    >
                        {msgStr("doRegister")}
                    </CbButton>
                )}
            </div>
        </form>
    );
}
