import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import type { KcClsx } from "keycloakify/login/lib/kcClsx";
import { VgSocialButton } from "@keycloak-theme/shared/ui";
import { IoLogoGoogle, IoLogoGithub, IoLogoMicrosoft } from "react-icons/io5";
import { SiWechat } from "react-icons/si";

/** Brand colors for each provider icon — distinct from the label's theme cyan. */
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
    /** When true, renders larger full-width buttons as primary CTAs. */
    prominent?: boolean;
}) {
    const { kcContext, i18n, prominent = false } = props;
    const { msgStr } = i18n;
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
                        label={msgStr("continueWith", provider.displayName)}
                        className={prominent ? "py-3.5 text-base font-medium" : ""}
                    />
                ))}
            </div>
        </div>
    );
}
