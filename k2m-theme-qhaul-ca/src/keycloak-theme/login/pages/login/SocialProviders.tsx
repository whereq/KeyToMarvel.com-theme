import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import type { KcClsx } from "keycloakify/login/lib/kcClsx";
import { QhSocialButton } from "@keycloak-theme/shared/ui";
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

/** Short per-provider i18n keys, matching the brand design's compact 2-col social buttons. */
const SHORT_LABEL_KEYS: Record<string, Parameters<I18n["msgStr"]>[0]> = {
    google: "socialGoogleLabel" as Parameters<I18n["msgStr"]>[0],
    wechat: "socialWechatLabel" as Parameters<I18n["msgStr"]>[0],
};

export default function SocialProviders(props: {
    kcContext: Extract<KcContext, { pageId: "login.ftl" }>;
    i18n: I18n;
    kcClsx: KcClsx;
    prominent?: boolean;
}) {
    const { kcContext, i18n } = props;
    const { msgStr } = i18n;
    const { social } = kcContext;

    if (!social?.providers || social.providers.length === 0) return null;

    return (
        <div id="kc-social-providers">
            <div className="grid grid-cols-2 gap-2">
                {social.providers.map(provider => {
                    const key = provider.alias.toLowerCase();
                    const labelKey = SHORT_LABEL_KEYS[key];
                    const label = labelKey ? msgStr(labelKey) : provider.displayName;
                    return (
                        <QhSocialButton
                            key={provider.alias}
                            href={provider.loginUrl}
                            icon={resolveIcon(provider.alias)}
                            label={label}
                        />
                    );
                })}
            </div>
        </div>
    );
}
