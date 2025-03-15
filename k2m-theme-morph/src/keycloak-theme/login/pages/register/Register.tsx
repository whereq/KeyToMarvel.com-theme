import { useState, useRef } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "@keycloak-theme/login/KcContext";
import type { I18n } from "@keycloak-theme/login/i18n";
import RegisterForm from "@keycloak-theme/login/pages/register/RegisterForm";

type RegisterProps = PageProps<Extract<KcContext, { pageId: "register.ftl" }>, I18n> & {
    doMakeUserConfirmPassword: boolean;
};

export default function Register(props: RegisterProps) {
    const { kcContext, i18n, doUseDefaultCss, Template, doMakeUserConfirmPassword } = props;
    const { messageHeader, messagesPerField, url, recaptchaRequired, recaptchaVisible, recaptchaSiteKey, recaptchaAction, termsAcceptanceRequired } = kcContext;
    const { msg, msgStr, advancedMsg } = i18n;

    const [areTermsAccepted, setAreTermsAccepted] = useState(false);
    const registerFormRef = useRef<{ validateForm: () => boolean }>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const isFormValid = registerFormRef.current?.validateForm() || false;
        if (!isFormValid || (termsAcceptanceRequired && !areTermsAccepted)) {
            console.error("Form is invalid or terms not accepted");
            return; // Stop submission if form is invalid or terms not accepted
        }
        console.log("Form is valid, proceeding with registration");
        (document.getElementById("kc-register-form") as HTMLFormElement).submit();
    };

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            headerNode={messageHeader !== undefined ? advancedMsg(messageHeader) : msg("registerTitle")}
            displayMessage={messagesPerField.exists("global")}
            displayRequiredFields
        >
            <form id="kc-register-form" className="space-y-4" action={url.registrationAction} method="post" onSubmit={handleSubmit}>
                <RegisterForm
                    ref={registerFormRef}
                    kcContext={kcContext}
                    i18n={i18n}
                    doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                />
                {termsAcceptanceRequired && (
                    <TermsAcceptance
                        i18n={i18n}
                        messagesPerField={messagesPerField}
                        areTermsAccepted={areTermsAccepted}
                        onAreTermsAcceptedValueChange={setAreTermsAccepted}
                    />
                )}
                {recaptchaRequired && (recaptchaVisible || recaptchaAction === undefined) && (
                    <div className="form-group">
                        <div className="g-recaptcha" data-size="compact" data-sitekey={recaptchaSiteKey} data-action={recaptchaAction}></div>
                    </div>
                )}
                <div className="flex justify-between items-center">
                    <div>
                        <a href={url.loginUrl} className="text-blue-400 hover:text-blue-300">
                            {msg("backToLogin")}
                        </a>
                    </div>
                    {recaptchaRequired && !recaptchaVisible && recaptchaAction !== undefined ? (
                        <button
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            data-sitekey={recaptchaSiteKey}
                            data-callback={() => {
                                (document.getElementById("kc-register-form") as HTMLFormElement).submit();
                            }}
                            data-action={recaptchaAction}
                            type="submit"
                            disabled={termsAcceptanceRequired && !areTermsAccepted}
                        >
                            {msg("doRegister")}
                        </button>
                    ) : (
                        <input
                            disabled={termsAcceptanceRequired && !areTermsAccepted}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            type="submit"
                            value={msgStr("doRegister")}
                        />
                    )}
                </div>
            </form>
        </Template>
    );
}

function TermsAcceptance(props: {
    i18n: I18n;
    messagesPerField: Pick<KcContext["messagesPerField"], "existsError" | "get">;
    areTermsAccepted: boolean;
    onAreTermsAcceptedValueChange: (areTermsAccepted: boolean) => void;
}) {
    const { i18n, messagesPerField, areTermsAccepted, onAreTermsAcceptedValueChange } = props;
    const { msg } = i18n;

    return (
        <>
            <div className="mb-4">
                <div className="text-gray-300">
                    {msg("termsTitle")}
                    <div id="kc-registration-terms-text" className="mt-2 text-sm text-gray-400">
                        {msg("termsText")}
                    </div>
                </div>
            </div>
            <div className="mb-4">
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="termsAccepted"
                        name="termsAccepted"
                        className="mr-2"
                        checked={areTermsAccepted}
                        onChange={e => onAreTermsAcceptedValueChange(e.target.checked)}
                        aria-invalid={messagesPerField.existsError("termsAccepted")}
                    />
                    <label htmlFor="termsAccepted" className="text-gray-300">
                        {msg("acceptTerms")}
                    </label>
                </div>
                {messagesPerField.existsError("termsAccepted") && (
                    <div className="mt-1 text-sm text-red-400">
                        <span
                            id="input-error-terms-accepted"
                            aria-live="polite"
                            dangerouslySetInnerHTML={{
                                __html: kcSanitize(messagesPerField.get("termsAccepted"))
                            }}
                        />
                    </div>
                )}
            </div>
        </>
    );
}