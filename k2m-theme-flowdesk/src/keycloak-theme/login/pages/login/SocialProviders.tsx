import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import type { KcClsx } from "keycloakify/login/lib/kcClsx";
import { FdSocialButton } from "@keycloak-theme/shared/ui";
import { IoLogoGoogle, IoLogoGithub, IoLogoMicrosoft } from "react-icons/io5";
import { SiWechat } from "react-icons/si";

const knownIcons: Record<string, React.ReactNode> = {
    google:    <IoLogoGoogle    style={{ color: "#4285F4" }} />,
    github:    <IoLogoGithub   style={{ color: "#e6edf3" }} />,
    microsoft: <IoLogoMicrosoft style={{ color: "#00a4ef" }} />,
    wechat:    <SiWechat        style={{ color: "#07C160" }} />,
};

function resolveIcon(providerId: string): React.ReactNode | undefined {
    const key = providerId.toLowerCase().replace(/[^a-z]/g, "");
    return knownIcons[key];
}

export default function SocialProviders(props: {
    kcContext: Extract<KcContext, { pageId: "login.ftl" }>;
    i18n: I18n;
    kcClsx: KcClsx;
    prominent?: boolean;
}) {
    const { kcContext, i18n, prominent = false } = props;
    const { msgStr } = i18n;
    const { social } = kcContext;

    if (!social?.providers || social.providers.length === 0) return null;

    return (
        <div id="kc-social-providers">
            <div className="grid gap-2.5">
                {social.providers.map(provider => (
                    <FdSocialButton
                        key={provider.alias}
                        href={provider.loginUrl}
                        icon={resolveIcon(provider.alias)}
                        label={msgStr("continueWith", provider.displayName)}
                        className={prominent ? "py-3.5 text-base" : ""}
                    />
                ))}
            </div>
        </div>
    );
}
