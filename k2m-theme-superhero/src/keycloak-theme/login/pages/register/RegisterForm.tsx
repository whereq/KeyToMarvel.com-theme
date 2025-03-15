import type { JSX } from "keycloakify/tools/JSX";
import type { LazyOrNot } from "keycloakify/tools/LazyOrNot";
import type { KcClsx } from "keycloakify/login/lib/kcClsx";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import type { KcContext } from "@keycloak-theme/login/KcContext";
import type { I18n } from "@keycloak-theme/login/i18n";
import TermsAcceptance from "@keycloak-theme/login/pages/register/TermsAcceptance";
import RecaptchaField from "@keycloak-theme/login/pages/register/RecaptchaField";
import FormButtons from "@keycloak-theme/login/pages/register/FormButtons";

export default function RegisterForm(props: {
    kcContext: Extract<KcContext, { pageId: "register.ftl" }>;
    i18n: I18n;
    kcClsx: KcClsx;
    UserProfileFormFields: LazyOrNot<(props: UserProfileFormFieldsProps) => JSX.Element>;
    doMakeUserConfirmPassword: boolean;
    isFormSubmittable: boolean;
    setIsFormSubmittable: (value: boolean) => void;
    areTermsAccepted: boolean;
    setAreTermsAccepted: (value: boolean) => void;
}) {
    const {
        kcContext,
        i18n,
        kcClsx,
        UserProfileFormFields,
        doMakeUserConfirmPassword,
        isFormSubmittable,
        setIsFormSubmittable,
        areTermsAccepted,
        setAreTermsAccepted
    } = props;

    const { url, termsAcceptanceRequired = false } = kcContext;

    return (
        <form
            id="kc-register-form"
            className="space-y-4 bg-gray-800 p-4 rounded-sm"
            action={url.registrationAction}
            method="post"
        >
            <UserProfileFormFields
                kcContext={kcContext}
                i18n={i18n}
                kcClsx={kcClsx}
                onIsFormSubmittableValueChange={setIsFormSubmittable}
                doMakeUserConfirmPassword={doMakeUserConfirmPassword}
            />
            {termsAcceptanceRequired && (
                <TermsAcceptance
                    i18n={i18n}
                    kcClsx={kcClsx}
                    messagesPerField={kcContext.messagesPerField}
                    areTermsAccepted={areTermsAccepted}
                    onAreTermsAcceptedValueChange={setAreTermsAccepted}
                />
            )}
            <RecaptchaField kcContext={kcContext} kcClsx={kcClsx} />
            <FormButtons
                kcContext={kcContext}
                i18n={i18n}
                kcClsx={kcClsx}
                isFormSubmittable={isFormSubmittable}
                areTermsAccepted={areTermsAccepted}
                termsAcceptanceRequired={termsAcceptanceRequired}
            />
        </form>
    );
}