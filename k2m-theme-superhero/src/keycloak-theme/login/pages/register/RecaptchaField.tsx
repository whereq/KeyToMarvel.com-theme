import type { KcClsx } from "keycloakify/login/lib/kcClsx";
import type { KcContext } from "@/keycloak-theme/layout/KcContext";

export default function RecaptchaField(props: {
    kcContext: Extract<KcContext, { pageId: "register.ftl" }>;
    kcClsx: KcClsx;
}) {
    const { kcContext, kcClsx } = props;
    const { recaptchaRequired, recaptchaVisible, recaptchaSiteKey, recaptchaAction } = kcContext;

    return (
        <>
            {recaptchaRequired && (recaptchaVisible || recaptchaAction === undefined) && (
                <div className="form-group">
                    <div className={kcClsx("kcInputWrapperClass")}>
                        <div className="g-recaptcha" data-size="compact" data-sitekey={recaptchaSiteKey} data-action={recaptchaAction}></div>
                    </div>
                </div>
            )}
        </>
    );
}