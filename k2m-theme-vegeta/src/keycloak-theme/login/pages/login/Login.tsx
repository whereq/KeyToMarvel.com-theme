import { useState } from "react";
import { VgYinYangIcon } from "@keycloak-theme/shared/ui";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import type { VgTemplateProps } from "@keycloak-theme/layout/Template";
import { VgDivider } from "@keycloak-theme/shared/ui";
import LoginForm from "./LoginForm";
import SocialProviders from "./SocialProviders";

/* ── Left panel: brand identity ── */
function BrandPanel({ i18n }: { i18n: I18n }) {
    const { msgStr } = i18n;
    const bullets = [
        msgStr("brandBullet1"),
        msgStr("brandBullet2"),
        msgStr("brandBullet3"),
    ];

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: "32px",
                maxWidth: "360px",
            }}
        >
            {/* Slow-spinning YinYang */}
            <VgYinYangIcon
                size={96}
                spinning
                style={{ filter: "drop-shadow(0 0 18px #f59e0b55) drop-shadow(0 0 4px #fbbf24)" }}
            />

            {/* Title + tagline */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <h2
                    style={{
                        margin: 0,
                        fontSize: "2.2rem",
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                        lineHeight: 1.1,
                        background: "linear-gradient(135deg, var(--vg-gold-400) 0%, var(--vg-cyan-400) 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                    }}
                >
                    Key to Marvel
                </h2>
                <p
                    style={{
                        margin: 0,
                        fontSize: "0.95rem",
                        color: "var(--vg-text-secondary)",
                        lineHeight: 1.5,
                    }}
                >
                    {msgStr("brandTagline")}
                </p>
            </div>

            {/* Feature bullets */}
            <ul
                style={{
                    listStyle: "none",
                    margin: 0,
                    padding: 0,
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                }}
            >
                {bullets.map(text => (
                    <li
                        key={text}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            padding: "7px 12px",
                            borderRadius: "var(--vg-radius-sm)",
                            color: "var(--vg-text-secondary)",
                            fontSize: "0.83rem",
                        }}
                    >
                        <span
                            style={{
                                width: "5px",
                                height: "5px",
                                borderRadius: "50%",
                                background: "var(--vg-purple-400)",
                                flexShrink: 0,
                            }}
                        />
                        {text}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function Login(
    props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>,
) {
    const { kcContext, i18n, doUseDefaultCss, classes } = props;
    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });
    const { realm, messagesPerField, social } = kcContext;
    const { msg } = i18n;

    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);

    const hasSocialProviders = (social?.providers?.length ?? 0) > 0;

    // Cast to our extended template type so we can pass layoutVariant + leftPanelNode
    const Template = props.Template as React.ComponentType<VgTemplateProps>;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!messagesPerField.existsError("username", "password")}
            headerNode={msg("loginAccountTitle")}
            displayInfo={
                realm.password &&
                realm.registrationAllowed &&
                !kcContext.registrationDisabled
            }
            infoNode={
                <span style={{ color: "var(--vg-text-secondary)" }}>
                    {msg("noAccount")}{" "}
                    <a
                        href={kcContext.url.registrationUrl}
                        style={{ color: "var(--vg-cyan-400)", fontWeight: 500 }}
                    >
                        {msg("doRegister")}
                    </a>
                </span>
            }
            layoutVariant="split"
            leftPanelNode={<BrandPanel i18n={i18n} />}
        >
            {/* Social providers — shown first (primary CTAs) */}
            {hasSocialProviders && (
                <div style={{ marginBottom: "4px" }}>
                    <SocialProviders
                        kcContext={kcContext}
                        i18n={i18n}
                        kcClsx={kcClsx}
                        prominent
                    />
                </div>
            )}

            {/* Divider between social and email/password form */}
            {hasSocialProviders && realm.password && (
                <VgDivider>{msg("or")}</VgDivider>
            )}

            {/* Email / password form */}
            <LoginForm
                kcContext={kcContext}
                i18n={i18n}
                kcClsx={kcClsx}
                isLoginButtonDisabled={isLoginButtonDisabled}
                setIsLoginButtonDisabled={setIsLoginButtonDisabled}
            />
        </Template>
    );
}
