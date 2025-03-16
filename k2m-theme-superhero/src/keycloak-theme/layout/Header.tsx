import type { KcClsx } from "keycloakify/login/lib/kcClsx";
import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import { PiYinYangFill } from "react-icons/pi";

export default function Header(props: {
    kcContext: KcContext;
    i18n: I18n;
    kcClsx: KcClsx;
}) {
    const { kcContext, i18n } = props;
    const { realm } = kcContext;
    const { msg } = i18n;

    return (
        <div
            id="kc-header"
            className="border-b border-orange-700 bg-blue-700 h-[3.125rem] flex items-center px-4 fixed top-0 left-0 right-0 z-50 w-full"
        >
            <div
                id="kc-header-wrapper"
                className="flex items-center h-full border-orange-700"
            >
                <PiYinYangFill size={36} color="orange" className="mr-2" />
                <span className="text-orange-400 font-bold">{msg("loginTitleHtml", realm.displayNameHtml)}</span>
            </div>
        </div>
    );
}