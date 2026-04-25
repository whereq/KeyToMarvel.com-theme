import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import type { KcClsx } from "keycloakify/login/lib/kcClsx";
import { VgSocialButton } from "@keycloak-theme/shared/ui";
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
    /** When true, renders larger full-width buttons as primary CTAs. */
    prominent?: boolean;
}) {
    const { kcContext, prominent = false } = props;
    const { social } = kcContext;

    if (!social?.providers || social.providers.length === 0) return null;

    return (
        <div id="kc-social-providers">
            <div
                className="grid gap-2.5"
                style={{ gridTemplateColumns: "1fr" }}
            >
                {social.providers.map(provider => (
                    <VgSocialButton
                        key={provider.alias}
                        href={provider.loginUrl}
                        icon={resolveIcon(provider.alias)}
                        label={`Continue with ${provider.displayName}`}
                        className={prominent ? "py-3.5 text-base font-medium" : ""}
                    />
                ))}
            </div>
        </div>
    );
}
