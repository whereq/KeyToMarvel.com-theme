import { useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import type { CbTemplateProps } from "@keycloak-theme/layout/Template";
import { CbDivider } from "@keycloak-theme/shared/ui";
import LoginForm from "./LoginForm";
import SocialProviders from "./SocialProviders";

/* ── Left panel: CatoBigato brand identity ── */
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
                gap: "28px",
                maxWidth: "360px",
            }}
        >
            {/* Cat mascot */}
            <img
                src={`${import.meta.env.BASE_URL}resources/img/catobi-clean.png`}
                alt="Catobi the Cat"
                style={{
                    width: 140,
                    height: "auto",
                    filter: "drop-shadow(0 8px 24px rgba(232, 116, 59, 0.2))",
                }}
            />

            {/* Title + tagline */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <h2
                    style={{
                        margin: 0,
                        fontSize: "2rem",
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                        lineHeight: 1.1,
                        color: "var(--cb-text-primary)",
                    }}
                >
                    <span style={{ color: "var(--cb-orange-400)" }}>Cato</span>
                    <span style={{ color: "var(--cb-purple-500)" }}>Bigato</span>
                </h2>
                <p
                    style={{
                        margin: 0,
                        fontSize: "0.95rem",
                        color: "var(--cb-text-secondary)",
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
                    gap: "4px",
                }}
            >
                {bullets.map(text => (
                    <li
                        key={text}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            padding: "8px 14px",
                            borderRadius: "var(--cb-radius-sm)",
                            color: "var(--cb-text-secondary)",
                            fontSize: "0.85rem",
                        }}
                    >
                        <span
                            style={{
                                width: "6px",
                                height: "6px",
                                borderRadius: "50%",
                                background: "var(--cb-orange-400)",
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

    const Template = props.Template as React.ComponentType<CbTemplateProps>;

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
                <span style={{ color: "var(--cb-text-secondary)" }}>
                    {msg("noAccount")}{" "}
                    <a
                        href={kcContext.url.registrationUrl}
                        style={{ color: "var(--cb-purple-500)", fontWeight: 500 }}
                    >
                        {msg("doRegister")}
                    </a>
                </span>
            }
            layoutVariant="split"
            leftPanelNode={<BrandPanel i18n={i18n} />}
        >
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

            {hasSocialProviders && realm.password && (
                <CbDivider>{msg("or")}</CbDivider>
            )}

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
