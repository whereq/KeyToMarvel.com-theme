import { useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import type { FdTemplateProps } from "@keycloak-theme/layout/Template";
import { FdDivider } from "@keycloak-theme/shared/ui";
import LoginForm from "./LoginForm";
import SocialProviders from "./SocialProviders";
import mascotKey from "@/assets/mascot/mascot-key.png";

/* ───────────────────────── whereq.cc pin logo ───────────────────────── */
function QLogo({ size = 30 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" style={{ flexShrink: 0 }} aria-label="whereq.cc">
            <rect width="40" height="40" rx="3" fill="var(--accent)" />
            <circle cx="20" cy="17.5" r="7.4" stroke="#fff" strokeWidth="3.2" />
            <path d="M20 25.2 L20 33.5 L25.6 27.4 Z" fill="#fff" />
        </svg>
    );
}

/* ── Padlock chip glyph ── */
const LockGlyph = (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="10" width="16" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
);

/* ── Shield icon (security note) ── */
const ShieldIcon = (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3 4 6v6c0 4 3 7.5 8 9 5-1.5 8-5 8-9V6z" />
    </svg>
);

/* ── Arrow icon for submit button ── */
const ArrowIcon = (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
    </svg>
);

/* ───────── Encrypted-gallery preview: grid of sealed photo thumbnails ───────── */
const THUMB_GRADS = [
    ["#2E4B5C", "#8FBFCB"],
    ["#26403A", "#7FBFA3"],
    ["#5C4A2E", "#E0B77A"],
    ["#3A2E5C", "#A79ADD"],
    ["#5C2E3F", "#DD9AB0"],
    ["#1F3F4A", "#6FA8B8"],
];

function GalleryPreview({ i18n }: { i18n: I18n }) {
    const { msgStr } = i18n;
    return (
        <div style={{ position: "relative", background: "var(--bg-panel)", border: "1px solid var(--rule)", borderRadius: 3, overflow: "hidden" }}>
            {/* Card header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", borderBottom: "1px solid var(--rule)", background: "var(--surface-2)" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 9, fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-dim)" }}>
                    <span style={{ width: 3, height: 13, background: "var(--accent)", borderRadius: 1 }} />
                    {msgStr("vaultBar")}
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "var(--mono)", fontSize: 10.5, color: "var(--text-faint)" }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--success)", boxShadow: "0 0 0 3px rgba(63,199,206,.18)", animation: "fd-ticker-pulse 2s ease-in-out infinite" }} />
                    {msgStr("vaultSealed")}
                </span>
            </div>

            {/* Thumbnail grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, padding: 14 }}>
                {THUMB_GRADS.map((g, i) => (
                    <div
                        key={i}
                        style={{
                            position: "relative",
                            aspectRatio: "4 / 3",
                            borderRadius: 2,
                            overflow: "hidden",
                            background: `linear-gradient(${140 + i * 34}deg, ${g[0]}, ${g[1]})`,
                            animation: `wq-pop .4s cubic-bezier(.2,.8,.2,1) ${0.15 + i * 0.09}s backwards`,
                        }}
                    >
                        {/* frosted encrypted overlay */}
                        <div style={{ position: "absolute", inset: 0, backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)", background: "rgba(4,10,12,.12)" }} />
                        {/* lock chip */}
                        <span style={{
                            position: "absolute", top: 6, left: 6,
                            display: "inline-flex", alignItems: "center", gap: 4,
                            background: "rgba(4,10,12,.55)", color: "rgba(255,255,255,.9)",
                            borderRadius: 2, padding: "3px 6px", fontSize: 9,
                            backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
                        }}>
                            {LockGlyph}
                        </span>
                    </div>
                ))}
            </div>

            {/* Stat strip */}
            <StatStrip i18n={i18n} />
        </div>
    );
}

/* ── Stat strip under the preview ── */
function StatStrip({ i18n }: { i18n: I18n }) {
    const { msgStr } = i18n;
    const stats = [
        { k: msgStr("statPhotos"), v: "1,204", w: "88%", c: "var(--accent)" },
        { k: msgStr("statAlbums"), v: "18", w: "60%", c: "var(--info)" },
        { k: msgStr("statSealed"), v: "100%", w: "100%", c: "var(--success)" },
        { k: msgStr("statKeys"), v: "AES-256", w: "76%", c: "var(--memorial)" },
    ];
    return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderTop: "1px solid var(--rule)" }}>
            {stats.map((s, i) => (
                <div key={i} style={{ padding: "12px 12px", borderRight: i < 3 ? "1px solid var(--rule)" : "none" }}>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-faint)" }}>{s.k}</div>
                    <div style={{ fontFamily: "var(--display)", fontSize: 17, fontWeight: 700, color: "var(--text-warm)", letterSpacing: "-0.02em", marginTop: 3, whiteSpace: "nowrap" }}>{s.v}</div>
                    <div style={{ height: 3, background: "var(--surface-3)", borderRadius: 2, marginTop: 7, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: s.w, background: s.c, borderRadius: 2, transformOrigin: "left", animation: `wq-grow 1s cubic-bezier(.2,.8,.2,1) ${0.35 + i * 0.1}s backwards` }} />
                    </div>
                </div>
            ))}
        </div>
    );
}

/* ───────────────────────── full brand showcase (left panel) ───────────────────────── */
function BrandShowcase({ i18n }: { i18n: I18n }) {
    const { msgStr } = i18n;
    const facts = [msgStr("fact1"), msgStr("fact2"), msgStr("fact3")];
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 26 }}>
            {/* Wordmark */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <QLogo size={30} />
                <span style={{ fontFamily: "var(--display)", fontSize: 20, fontWeight: 800, letterSpacing: "-0.02em", color: "var(--text-warm)" }}>
                    whereq<span style={{ color: "var(--accent)" }}>.cc</span>
                </span>
                <span style={{
                    marginLeft: 4, fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.14em",
                    textTransform: "uppercase", color: "var(--text-faint)", alignSelf: "center",
                    border: "1px solid var(--rule)", borderRadius: 2, padding: "3px 7px",
                }}>
                    {msgStr("tagGallery")}
                </span>
            </div>

            {/* Hero */}
            <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 9, fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-faint)", border: "1px solid var(--rule-strong)", borderRadius: 2, padding: "6px 11px" }}>
                    <span style={{ width: 6, height: 6, background: "var(--accent)" }} />
                    {msgStr("brandEyebrow")}
                </div>
                <h1 style={{ margin: "16px 0 0", fontSize: "clamp(32px, 3.4vw, 46px)", lineHeight: 1.04, fontWeight: 800, letterSpacing: "-0.035em", color: "var(--text-warm)", maxWidth: "15ch" }}>
                    {msgStr("brandH1a")} <span style={{ color: "var(--accent)" }}>{msgStr("brandH1b")}</span>
                </h1>
                <p style={{ margin: "16px 0 0", fontSize: 15, lineHeight: 1.6, color: "var(--text-dim)", maxWidth: "46ch" }}>
                    {msgStr("brandSub")}
                </p>
            </div>

            {/* Encrypted gallery preview */}
            <GalleryPreview i18n={i18n} />

            {/* Facts + mascot */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: 18, marginTop: "auto" }}>
                <img src={mascotKey} alt="" style={{ width: 150, height: "auto", flexShrink: 0, animation: "wq-float 6s ease-in-out infinite" }} />
                <div style={{ display: "grid", gap: 11, paddingBottom: 14 }}>
                    {facts.map((f, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12.5, color: "var(--text-dim)" }}>
                            <span style={{ width: 5, height: 5, background: "var(--accent)", flexShrink: 0 }} />
                            {f}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function Login(
    props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>,
) {
    const { kcContext, i18n, doUseDefaultCss, classes } = props;
    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });
    const { realm, messagesPerField, social, url } = kcContext;
    const { msgStr } = i18n;

    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);
    const hasSocialProviders = (social?.providers?.length ?? 0) > 0;

    const Template = props.Template as React.ComponentType<FdTemplateProps>;

    const formHeader = (
        <>
            {/* Eyebrow */}
            <div style={{
                fontFamily: "var(--mono)", fontSize: "10px", letterSpacing: "0.16em",
                textTransform: "uppercase", color: "var(--accent)", marginBottom: "10px",
            }}>
                {msgStr("secureSignin")}
            </div>
            {/* Title */}
            <h2 style={{ margin: "0 0 4px", fontSize: "26px", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text-warm)" }}>
                {msgStr("loginAccountTitle")}
            </h2>
            {/* Subtitle */}
            <p style={{ margin: "0 0 24px", color: "var(--text-dim)", fontSize: "13.5px" }}>
                {msgStr("loginSubtitle")}
            </p>

            {/* Social providers */}
            {hasSocialProviders && (
                <SocialProviders kcContext={kcContext} i18n={i18n} kcClsx={kcClsx} prominent />
            )}
            {hasSocialProviders && realm.password && (
                <FdDivider>{msgStr("or")}</FdDivider>
            )}
        </>
    );

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!messagesPerField.existsError("username", "password")}
            headerNode={formHeader}
            displayInfo={realm.password && realm.registrationAllowed && !kcContext.registrationDisabled}
            infoNode={
                <span style={{ color: "var(--text-dim)" }}>
                    {msgStr("noAccount")}{" "}
                    <a href={url.registrationUrl} style={{ color: "var(--accent)", fontWeight: 600 }}>
                        {msgStr("doRegister")}
                    </a>
                </span>
            }
            layoutVariant="split"
            leftPanelNode={<BrandShowcase i18n={i18n} />}
        >
            <LoginForm
                kcContext={kcContext}
                i18n={i18n}
                kcClsx={kcClsx}
                isLoginButtonDisabled={isLoginButtonDisabled}
                setIsLoginButtonDisabled={setIsLoginButtonDisabled}
                submitIcon={ArrowIcon}
            />

            {/* Security note */}
            <div style={{
                marginTop: 18,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                color: "var(--text-faint)", fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.04em",
            }}>
                {ShieldIcon}
                <span>{msgStr("securedBy")}</span>
            </div>
        </Template>
    );
}
