import type { KcContext } from "@keycloak-theme/layout/KcContext";

export default function RecaptchaField(props: {
    kcContext: Extract<KcContext, { pageId: "register.ftl" }>;
}) {
    const { recaptchaRequired, recaptchaVisible, recaptchaSiteKey, recaptchaAction } = props.kcContext;

    if (!recaptchaRequired || (!recaptchaVisible && recaptchaAction !== undefined)) {
        return null;
    }

    return (
        <div className="mt-1">
            <div
                className="g-recaptcha"
                data-size="compact"
                data-sitekey={recaptchaSiteKey}
                data-action={recaptchaAction}
            />
        </div>
    );
}
