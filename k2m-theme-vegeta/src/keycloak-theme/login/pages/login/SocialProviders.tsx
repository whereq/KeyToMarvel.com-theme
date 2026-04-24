import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import type { KcClsx } from "keycloakify/login/lib/kcClsx";
import { VgDivider, VgSocialButton } from "@keycloak-theme/shared/ui";
import { IoLogoGoogle, IoLogoGithub, IoLogoMicrosoft } from "react-icons/io5";
import { SiWechat } from "react-icons/si";

const knownIcons: Record<string, React.ReactNode> = {
    google:    <IoLogoGoogle />,
    github:    <IoLogoGithub />,
    microsoft: <IoLogoMicrosoft />,
    wechat:    <SiWechat />,
};

function resolveIcon(providerId: string): React.ReactNode | undefined {
    const key = providerId.toLowerCase().replace(/[^a-z]/g, "");
    return knownIcons[key];
}

export default function SocialProviders(props: {
    kcContext: Extract<KcContext, { pageId: "login.ftl" }>;
    i18n: I18n;
    kcClsx: KcClsx;
}) {
    const { kcContext, i18n } = props;
    const { social } = kcContext;
    const { msg } = i18n;

    if (!social?.providers || social.providers.length === 0) return null;

    return (
        <div id="kc-social-providers">
            <VgDivider>{msg("identity-provider-login-label")}</VgDivider>
            <div
                className="grid gap-2"
                style={{
                    gridTemplateColumns: social.providers.length > 2 ? "1fr 1fr" : "1fr",
                }}
            >
                {social.providers.map(provider => (
                    <VgSocialButton
                        key={provider.alias}
                        href={provider.loginUrl}
                        icon={resolveIcon(provider.alias)}
                        label={provider.displayName}
                    />
                ))}
            </div>
        </div>
    );
}
