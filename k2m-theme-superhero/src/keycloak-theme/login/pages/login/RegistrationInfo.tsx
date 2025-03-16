import type { KcContext } from "@/keycloak-theme/layout/KcContext";
import type { I18n } from "@/keycloak-theme/layout/i18n";

export default function RegistrationInfo(props: {
    kcContext: Extract<KcContext, { pageId: "login.ftl" }>;
    i18n: I18n;
}) {
    const { kcContext, i18n } = props;
    const { realm, url, registrationDisabled } = kcContext;
    const { msg } = i18n;

    return (
        <>
            {realm.password && realm.registrationAllowed && !registrationDisabled && (
                <div id="kc-registration" className="bg-gray-800 mt-1 p-2 rounded-sm text-center">
                    <span className="text-orange-400">
                        {msg("noAccount")}{" "}
                        <a tabIndex={8} href={url.registrationUrl} className="text-blue-400 hover:text-blue-300">
                            {msg("doRegister")}
                        </a>
                    </span>
                </div>
            )}
        </>
    );
}