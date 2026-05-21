import { useState, useEffect } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import type { CqTemplateProps } from "@keycloak-theme/layout/Template";
import { CqDivider } from "@keycloak-theme/shared/ui";
import LoginForm from "./LoginForm";
import SocialProviders from "./SocialProviders";

/* ─────────────────────────────────────────────────────────────────────────
   Live clock hook
   ───────────────────────────────────────────────────────────────────────── */

function useNow() {
    const [now, setNow] = useState(() => new Date());
    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(id);
    }, []);
    return now;
}

function fmtTime(date: Date, tz: string): string {
    return new Intl.DateTimeFormat("en-GB", {
        timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: false,
    }).format(date);
}

function fmtSec(date: Date, tz: string): string {
    return new Intl.DateTimeFormat("en-GB", {
        timeZone: tz, second: "2-digit",
    }).format(date);
}

function fmtDate(date: Date): string {
    return new Intl.DateTimeFormat("en-US", {
        weekday: "short", month: "short", day: "numeric",
    }).format(date);
}

function getLocalTzLabel(): string {
    try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
        return "Local";
    }
}

/* ─────────────────────────────────────────────────────────────────────────
   City data
   ───────────────────────────────────────────────────────────────────────── */

const CITIES = [
    { label: "NEW YORK", tz: "America/New_York", region: "US" },
    { label: "LONDON",   tz: "Europe/London",    region: "GB" },
    { label: "TOKYO",    tz: "Asia/Tokyo",       region: "JP" },
    { label: "SHANGHAI", tz: "Asia/Shanghai",    region: "CN" },
] as const;

/* ─────────────────────────────────────────────────────────────────────────
   Deterministic weather
   ───────────────────────────────────────────────────────────────────────── */

type WeatherCondition = "sun" | "partly" | "cloud" | "rain" | "snow";

function getWeather(region: string, date: Date): { condition: WeatherCondition; temp: number } {
    const day = date.getUTCDate() + date.getUTCMonth() * 31;
    const seed = (day * 7 + region.charCodeAt(0) * 3) % 7;
    const conditions: WeatherCondition[] = ["sun", "partly", "cloud", "rain", "sun", "partly", "cloud"];
    const condition = conditions[seed];
    const baseTemp: Record<string, number> = { US: 18, GB: 14, JP: 22, CN: 24 };
    const temp = (baseTemp[region] ?? 20) + (seed % 5) - 2;
    return { condition, temp };
}

/* ─────────────────────────────────────────────────────────────────────────
   Weather icons (inline SVG paths)
   ───────────────────────────────────────────────────────────────────────── */

function WeatherIcon({ condition, size = 16 }: { condition: WeatherCondition; size?: number }) {
    switch (condition) {
        case "sun":
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--cq-tile-amber)" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="5" fill="var(--cq-tile-amber)" stroke="none" opacity="0.3" />
                    <circle cx="12" cy="12" r="4" stroke="var(--cq-tile-amber)" />
                    <line x1="12" y1="2"  x2="12" y2="5" />
                    <line x1="12" y1="19" x2="12" y2="22" />
                    <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
                    <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
                    <line x1="2"  y1="12" x2="5"  y2="12" />
                    <line x1="19" y1="12" x2="22" y2="12" />
                    <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
                    <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
                </svg>
            );
        case "partly":
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="9" cy="9" r="4" fill="var(--cq-tile-amber)" opacity="0.7" />
                    <path d="M18 17H6a4 4 0 0 1 0-8 5 5 0 0 1 9.9 1H18a3 3 0 0 1 0 7z" fill="var(--cq-muted)" opacity="0.7" />
                </svg>
            );
        case "cloud":
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M18 17H6a4 4 0 0 1 0-8 5 5 0 0 1 9.9 1H18a3 3 0 0 1 0 7z" fill="var(--cq-border-strong)" />
                </svg>
            );
        case "rain":
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M18 15H6a4 4 0 0 1 0-8 5 5 0 0 1 9.9 1H18a3 3 0 0 1 0 7z" fill="var(--cq-muted)" />
                    <line x1="8"  y1="19" x2="6"  y2="22" stroke="var(--cq-tile-blue)" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="12" y1="19" x2="10" y2="22" stroke="var(--cq-tile-blue)" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="16" y1="19" x2="14" y2="22" stroke="var(--cq-tile-blue)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            );
        case "snow":
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--cq-text-2)" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                    <path d="M18 15H6a4 4 0 0 1 0-8 5 5 0 0 1 9.9 1H18a3 3 0 0 1 0 7z" strokeWidth="0" fill="var(--cq-muted)" />
                    <line x1="8"  y1="19" x2="8"  y2="22" />
                    <line x1="12" y1="19" x2="12" y2="22" />
                    <line x1="16" y1="19" x2="16" y2="22" />
                    <line x1="7"  y1="20.5" x2="9"  y2="20.5" />
                    <line x1="11" y1="20.5" x2="13" y2="20.5" />
                    <line x1="15" y1="20.5" x2="17" y2="20.5" />
                </svg>
            );
    }
}

/* ─────────────────────────────────────────────────────────────────────────
   PulseCard — live clock widget
   ───────────────────────────────────────────────────────────────────────── */

function PulseCard({ now, pulseLabel }: { now: Date; pulseLabel: string }) {
    const sec = now.getSeconds();
    const colonVisible = sec % 2 === 0;
    const localTz = getLocalTzLabel();

    return (
        <div
            style={{
                background: "var(--cq-surface)",
                border: "1px solid var(--cq-border)",
                borderTop: "3px solid var(--cq-accent)",
                borderRadius: "var(--cq-r-sm)",
                padding: "16px 18px",
                width: "100%",
            }}
        >
            {/* Top row: label + date */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                <span
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontFamily: "var(--cq-font-mono)",
                        fontSize: "0.62rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.12em",
                        color: "var(--cq-muted)",
                        fontWeight: 600,
                    }}
                >
                    <span
                        style={{
                            width: "5px",
                            height: "5px",
                            borderRadius: "50%",
                            background: "var(--cq-tile-emerald)",
                            animation: "cq-pulse-dot 1.5s ease-in-out infinite",
                            flexShrink: 0,
                        }}
                    />
                    {pulseLabel}
                </span>
                <span
                    style={{
                        fontFamily: "var(--cq-font-mono)",
                        fontSize: "0.62rem",
                        color: "var(--cq-muted)",
                        letterSpacing: "0.05em",
                    }}
                >
                    {fmtDate(now)}
                </span>
            </div>

            {/* Large clock */}
            <div style={{ display: "flex", alignItems: "baseline", gap: "3px", marginBottom: "4px" }}>
                <span
                    style={{
                        fontFamily: "var(--cq-font-display)",
                        fontSize: "64px",
                        fontWeight: 700,
                        lineHeight: 1,
                        color: "var(--cq-text)",
                        letterSpacing: "-0.03em",
                    }}
                >
                    {fmtTime(now, localTz)}
                </span>
                <span
                    style={{
                        fontFamily: "var(--cq-font-mono)",
                        fontSize: "13px",
                        color: "var(--cq-muted)",
                        marginBottom: "6px",
                        opacity: colonVisible ? 1 : 0.2,
                        transition: "opacity 0.1s",
                        minWidth: "28px",
                    }}
                >
                    :{fmtSec(now, localTz)}
                </span>
            </div>

            {/* Timezone */}
            <div
                style={{
                    fontFamily: "var(--cq-font-mono)",
                    fontSize: "0.6rem",
                    color: "var(--cq-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: "14px",
                }}
            >
                {localTz}
            </div>

            {/* City grid */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "2px",
                }}
            >
                {CITIES.map(city => {
                    const { condition, temp } = getWeather(city.region, now);
                    return (
                        <div
                            key={city.label}
                            style={{
                                background: "var(--cq-surface-2)",
                                padding: "7px 10px",
                                borderRadius: "var(--cq-r-xs)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: "4px",
                            }}
                        >
                            <div>
                                <div
                                    style={{
                                        fontFamily: "var(--cq-font-mono)",
                                        fontSize: "0.58rem",
                                        color: "var(--cq-muted)",
                                        letterSpacing: "0.08em",
                                        textTransform: "uppercase",
                                        marginBottom: "2px",
                                    }}
                                >
                                    {city.label}
                                </div>
                                <div
                                    style={{
                                        fontFamily: "var(--cq-font-display)",
                                        fontSize: "0.95rem",
                                        fontWeight: 600,
                                        color: "var(--cq-text)",
                                        letterSpacing: "-0.01em",
                                    }}
                                >
                                    {fmtTime(now, city.tz)}
                                </div>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                                <WeatherIcon condition={condition} size={15} />
                                <span
                                    style={{
                                        fontFamily: "var(--cq-font-mono)",
                                        fontSize: "0.6rem",
                                        color: "var(--cq-text-2)",
                                    }}
                                >
                                    {temp}°
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────────────────
   Bullet dot colors
   ───────────────────────────────────────────────────────────────────────── */

const BULLET_COLORS = [
    "var(--cq-tile-blue)",
    "var(--cq-tile-amber)",
    "var(--cq-tile-emerald)",
] as const;

/* ─────────────────────────────────────────────────────────────────────────
   Lock icon for auth panel
   ───────────────────────────────────────────────────────────────────────── */

function LockIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--cq-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
    );
}

/* ─────────────────────────────────────────────────────────────────────────
   Full brand panel (left showcase)
   ───────────────────────────────────────────────────────────────────────── */

function CqBrandPanel({ i18n }: { i18n: I18n }) {
    const { msgStr } = i18n;
    const now = useNow();

    const bullets = [
        { text: msgStr("brandBullet1" as Parameters<typeof msgStr>[0]), color: BULLET_COLORS[0] },
        { text: msgStr("brandBullet2" as Parameters<typeof msgStr>[0]), color: BULLET_COLORS[1] },
        { text: msgStr("brandBullet3" as Parameters<typeof msgStr>[0]), color: BULLET_COLORS[2] },
    ];

    const eyebrow  = msgStr("brandEyebrow"  as Parameters<typeof msgStr>[0]);
    const headline = msgStr("brandHeadline" as Parameters<typeof msgStr>[0]);
    const sub      = msgStr("brandSub"      as Parameters<typeof msgStr>[0]);
    const pulseNow = msgStr("pulseNow"      as Parameters<typeof msgStr>[0]);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "20px",
                width: "100%",
                maxWidth: "480px",
                position: "relative",
                zIndex: 1,
            }}
        >
            {/* Eyebrow */}
            <span
                style={{
                    fontFamily: "var(--cq-font-mono)",
                    fontSize: "0.65rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    color: "var(--cq-muted)",
                    fontWeight: 500,
                }}
            >
                {eyebrow}
            </span>

            {/* Headline */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <h2
                    style={{
                        margin: 0,
                        fontSize: "44px",
                        fontWeight: 700,
                        letterSpacing: "-0.03em",
                        lineHeight: 1.05,
                        color: "var(--cq-text)",
                        fontFamily: "var(--cq-font-display)",
                    }}
                >
                    {headline}
                </h2>
                <p
                    style={{
                        margin: 0,
                        fontSize: "15px",
                        color: "var(--cq-text-2)",
                        lineHeight: 1.5,
                        maxWidth: "380px",
                    }}
                >
                    {sub}
                </p>
            </div>

            {/* PulseCard */}
            <PulseCard now={now} pulseLabel={pulseNow} />

            {/* Feature bullets */}
            <ul
                style={{
                    listStyle: "none",
                    margin: 0,
                    padding: 0,
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                }}
            >
                {bullets.map(({ text, color }) => (
                    <li
                        key={text}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            color: "var(--cq-text-2)",
                            fontSize: "0.875rem",
                        }}
                    >
                        <span
                            style={{
                                width: "6px",
                                height: "6px",
                                background: color,
                                flexShrink: 0,
                                display: "inline-block",
                                borderRadius: "1px",
                            }}
                        />
                        {text}
                    </li>
                ))}
            </ul>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────────────────
   Lock badge (shown above auth card title)
   ───────────────────────────────────────────────────────────────────────── */

function OidcBadge() {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginBottom: "8px",
            }}
        >
            <LockIcon />
            <span
                style={{
                    fontFamily: "var(--cq-font-mono)",
                    fontSize: "10.5px",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "var(--cq-muted)",
                }}
            >
                Single sign-on · OIDC
            </span>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────────────────
   Main Login page
   ───────────────────────────────────────────────────────────────────────── */

export default function Login(
    props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>,
) {
    const { kcContext, i18n, doUseDefaultCss, classes } = props;
    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });
    const { realm, messagesPerField, social } = kcContext;
    const { msg } = i18n;

    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);
    const hasSocialProviders = (social?.providers?.length ?? 0) > 0;

    const Template = props.Template as React.ComponentType<CqTemplateProps>;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!messagesPerField.existsError("username", "password")}
            headerNode={
                <>
                    <OidcBadge />
                    {msg("loginAccountTitle")}
                </>
            }
            displayInfo={
                realm.password &&
                realm.registrationAllowed &&
                !kcContext.registrationDisabled
            }
            infoNode={
                <span style={{ color: "var(--cq-text-2)" }}>
                    {msg("noAccount")}{" "}
                    <a
                        href={kcContext.url.registrationUrl}
                        style={{ color: "var(--cq-accent)", fontWeight: 500 }}
                    >
                        {msg("doRegister")}
                    </a>
                </span>
            }
            layoutVariant="split"
            leftPanelNode={<CqBrandPanel i18n={i18n} />}
        >
            {/* Social providers */}
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
                <CqDivider>{msg("or")}</CqDivider>
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
