import type { KcContext } from "@/keycloak-theme/layout/KcContext";
import type { I18n } from "@/keycloak-theme/layout/i18n";
import type { KcClsx } from "keycloakify/login/lib/kcClsx";
import { IoLogoGoogle, IoLogoWechat } from "react-icons/io5";

export default function SocialProviders(props: {
    kcContext: Extract<KcContext, { pageId: "login.ftl" }>;
    i18n: I18n;
    kcClsx: KcClsx;
}) {
    const { kcContext } = props;
    const { social, realm } = kcContext;

    // Dummy social providers for testing
    const dummyProviders = [
        {
            alias: "wechat",
            displayName: "WeChat",
            loginUrl: "/realms/whereq/broker/wechat/login?client_id=account-console",
        },
        {
            alias: "google",
            displayName: "Google",
            loginUrl: "/realms/whereq/broker/google/login?client_id=account-console",
        },
    ];

    // Use dummy providers if no social providers are available
    const providers = social?.providers?.length ? social.providers : dummyProviders;

    return (
        <>
            {realm.password && providers.length !== 0 && (
                <div id="k2m-social-providers" className="w-full">
                    {/* Separator line with "OR" in the middle */}
                    <div className="flex items-center justify-center my-4">
                        <hr className="border-gray-400 flex-grow" />
                        <span className="px-4 text-gray-400 font-open-sans font-bold">OR</span>
                        <hr className="border-gray-400 flex-grow" />
                    </div>

                    {/* Social sign-in buttons */}
                    <ul className="grid grid-cols-2 gap-1">
                        {providers.map((p) => (
                            <li key={p.alias}>
                                <a
                                    id={`social-${p.alias}`}
                                    className="bg-gray-800 hover:bg-gray-600 text-orange-400 font-bold px-4 py-2 rounded-sm flex items-center justify-center space-x-2"
                                    type="button"
                                    href={p.loginUrl}
                                >
                                    {p.alias === "wechat" && <IoLogoWechat className="w-6 h-6" />}
                                    {p.alias === "google" && <IoLogoGoogle className="w-6 h-6" />}
                                    <span className="font-bold">{p.displayName}</span>
                                </a>
                            </li>
                        ))}
                    </ul>

                </div>
            )}
        </>
    );
}