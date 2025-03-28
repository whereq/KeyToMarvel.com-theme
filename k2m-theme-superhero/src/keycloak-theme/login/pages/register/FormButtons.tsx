import type { KcClsx } from "keycloakify/login/lib/kcClsx";
import type { KcContext } from "@/keycloak-theme/layout/KcContext";
import type { I18n } from "@/keycloak-theme/layout/i18n";

import { K2MButtonStyle } from "@/keycloak-theme/shared/k2m-ui-shared/types/k2m-types";
import { K2MButton } from "@/keycloak-theme/shared/k2m-ui-shared/buttons/K2MButton";

export default function FormButtons(props: {
    kcContext: Extract<KcContext, { pageId: "register.ftl" }>;
    i18n: I18n;
    kcClsx: KcClsx;
    isFormSubmittable: boolean;
    areTermsAccepted: boolean;
    termsAcceptanceRequired: boolean;
}) {
    const { kcContext, i18n, kcClsx, isFormSubmittable, areTermsAccepted, termsAcceptanceRequired } = props;
    const { url, recaptchaRequired, recaptchaVisible, recaptchaSiteKey, recaptchaAction } = kcContext;
    const { msg, msgStr } = i18n;

    return (
        <div className="flex justify-between items-center">
            <div id="kc-form-options" className={kcClsx("kcFormOptionsClass")}>
                <div className="text-blue-400 hover:text-blue-300">
                    <span>
                        <a href={url.loginUrl}>{msg("backToLogin")}</a>
                    </span>
                </div>
            </div>

            {recaptchaRequired && !recaptchaVisible && recaptchaAction !== undefined ? (
                <div id="kc-form-buttons" className={kcClsx("kcFormButtonsClass")}>
                    {/* <button
                        className="px-4 py-2 bg-blue-600 text-orange-400 rounded-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        data-sitekey={recaptchaSiteKey}
                        data-callback={() => {
                            (document.getElementById("kc-register-form") as HTMLFormElement).submit();
                        }}
                        data-action={recaptchaAction}
                        type="submit"
                    >
                        {msg("doRegister")}
                    </button> */}
                    <K2MButton
                        styleType={K2MButtonStyle.PRIMARY}
                        name="register"
                        data-sitekey={recaptchaSiteKey}
                        data-callback={() => {
                            (document.getElementById("kc-register-form") as HTMLFormElement).submit();
                        }}
                        data-action={recaptchaAction}
                        type="submit"
                    >
                        {msgStr("doRegister")}
                    </K2MButton>
                </div>
            ) : (
                <div id="kc-form-buttons" className={kcClsx("kcFormButtonsClass")}>
                    {/* <input
                        disabled={!isFormSubmittable || (termsAcceptanceRequired && !areTermsAccepted)}
                        className="px-4 py-2 bg-blue-600 text-orange-400 rounded-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        type="submit"
                        value={msgStr("doRegister")}
                    /> */}
                    <K2MButton
                        disabled={!isFormSubmittable || (termsAcceptanceRequired && !areTermsAccepted)}
                        styleType={K2MButtonStyle.PRIMARY}
                        name="register"
                        type="submit"
                    >
                        {msgStr("doRegister")}
                    </K2MButton>
                </div>
            )}
        </div>
    );
}