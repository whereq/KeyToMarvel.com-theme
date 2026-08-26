import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import type { KcClsx } from "keycloakify/login/lib/kcClsx";

/* Google wordmark SVG (inline, no icon lib needed) */
const GoogleIcon = (
    <svg viewBox="0 0 18 18" width="18" height="18" aria-hidden="true">
        <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"/>
        <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.34A9 9 0 0 0 9 18z"/>
        <path fill="#FBBC05" d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.94H.96a9 9 0 0 0 0 8.12l3.01-2.34z"/>
        <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.46 3.44 1.35l2.58-2.58A9 9 0 0 0 .96 4.94l3.01 2.34C4.68 5.16 6.66 3.58 9 3.58z"/>
    </svg>
);

const WeChatIcon = (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path fill="#07C160" d="M8.69 4C4.66 4 1.4 6.7 1.4 10.03c0 1.9 1.06 3.6 2.72 4.74l-.68 2.05 2.38-1.2c.85.17 1.53.34 2.38.34.21 0 .42-.01.63-.03a4.6 4.6 0 0 1-.19-1.3c0-2.86 2.79-5.18 6.23-5.18l.42.01C14.97 6.13 12.1 4 8.69 4zm-2.4 4.06a.9.9 0 1 1 0-1.8.9.9 0 0 1 0 1.8zm4.82 0a.9.9 0 1 1 0-1.8.9.9 0 0 1 0 1.8z"/>
        <path fill="#07C160" d="M22.6 14.7c0-2.78-2.79-5.05-5.93-5.05-3.32 0-5.94 2.27-5.94 5.05 0 2.79 2.62 5.05 5.94 5.05.69 0 1.4-.17 2.09-.34l1.9 1.05-.52-1.74c1.4-1.06 2.46-2.45 2.46-4.02zm-7.86-.85a.74.74 0 1 1 0-1.48.74.74 0 0 1 0 1.48zm3.86 0a.74.74 0 1 1 0-1.48.74.74 0 0 1 0 1.48z"/>
    </svg>
);

const ICON_MAP: Record<string, React.ReactNode> = {
    google:  GoogleIcon,
    wechat:  WeChatIcon,
};

function resolveIcon(providerId: string): React.ReactNode | undefined {
    const key = providerId.toLowerCase().replace(/[^a-z]/g, "");
    return ICON_MAP[key];
}

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
        <div id="kc-social-providers" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {social.providers.map(provider => (
                <a
                    key={provider.alias}
                    href={provider.loginUrl}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 10,
                        height: 46,
                        border: "1px solid var(--rule-strong)",
                        borderRadius: 6,
                        fontSize: "13.5px",
                        fontWeight: 500,
                        color: "var(--text)",
                        textDecoration: "none",
                        transition: "border-color .15s, background .15s",
                    }}
                    onMouseEnter={e => {
                        (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--text-faint)";
                        (e.currentTarget as HTMLAnchorElement).style.background = "var(--field)";
                    }}
                    onMouseLeave={e => {
                        (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--rule-strong)";
                        (e.currentTarget as HTMLAnchorElement).style.background = "";
                    }}
                >
                    {resolveIcon(provider.alias)}
                    <span>{msgStr("continueWith", provider.displayName)}</span>
                </a>
            ))}
        </div>
    );
}
