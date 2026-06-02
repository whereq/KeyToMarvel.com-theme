import { useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import type { FdTemplateProps } from "@keycloak-theme/layout/Template";
import { FdDivider } from "@keycloak-theme/shared/ui";
import LoginForm from "./LoginForm";
import SocialProviders from "./SocialProviders";

/* ───────────────────────── Mono-Q logo ───────────────────────── */
function QLogo({ size = 34 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ flexShrink: 0 }}>
            <rect x="2" y="2" width="28" height="28" rx="3" fill="var(--accent)" />
            <text x="16" y="23" textAnchor="middle" fontSize="20" fontWeight={700} fontFamily="var(--ui)" fill="var(--accent-ink)">Q</text>
        </svg>
    );
}

/* ───────────────────────── feature icons ───────────────────────── */
const FeatIc: Record<string, React.ReactNode> = {
    compass: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><polygon points="15.5 8.5 11 11 8.5 15.5 13 13" fill="currentColor" stroke="none" /></svg>
    ),
    book: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h6a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4z" /><path d="M20 4h-6a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h6z" /></svg>
    ),
    people: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0M16 6a3 3 0 0 1 0 6M21 20a6 6 0 0 0-4-5.6" /></svg>
    ),
    pen: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></svg>
    ),
};

/* ───────────────────────── animated map showcase ───────────────────────── */
function ShowcasePin({ p }: { p: { x: number; y: number; kind: string; delay: number } }) {
    const style: React.CSSProperties = {
        transformBox: "fill-box",
        transformOrigin: "center bottom",
        animation: `wq-pop .45s cubic-bezier(.2,.8,.2,1) ${p.delay}s backwards`,
    };
    if (p.kind === "me") {
        return (
            <g transform={`translate(${p.x},${p.y})`}>
                <circle r="20" fill="var(--accent)" opacity="0.14">
                    <animate attributeName="r" values="12;26;12" dur="2.4s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.2;0;0.2" dur="2.4s" repeatCount="indefinite" />
                </circle>
                <circle r="8" fill="var(--accent)" stroke="#fff" strokeWidth="2.5" />
            </g>
        );
    }
    const map: Record<string, React.ReactNode> = {
        school: (<><rect x="-10" y="-12" width="20" height="20" rx="2" fill="var(--school)" stroke="#fff" strokeWidth="1.5" /><polygon points="-11,-12 0,-18 11,-12" fill="var(--school)" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" /></>),
        memorial: (<><path d="M0 -18 C -9 -18 -13 -11 -13 -6 C -13 3 0 11 0 11 C 0 11 13 3 13 -6 C 13 -11 9 -18 0 -18 Z" fill="var(--memorial)" stroke="#fff" strokeWidth="1.5" /><circle cx="0" cy="-7" r="4" fill="#fff" /></>),
        friend: (<><circle r="13" fill="var(--bg-panel)" stroke="var(--social)" strokeWidth="2.5" /><text y="4" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--social)">M</text><circle cx="9" cy="-9" r="3.5" fill="var(--success)" stroke="var(--bg-panel)" strokeWidth="1.2" /></>),
        hazard: (<><polygon points="0,-12 11,8 -11,8" fill="var(--danger)" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" /><text y="6" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff">!</text></>),
        poi: (<circle r="8" fill="#A0763C" stroke="#fff" strokeWidth="1.5" />),
        poi2: (<><circle r="9" fill="#34D399" stroke="#fff" strokeWidth="1.5" /><rect x="-1.4" y="-5" width="2.8" height="10" fill="#fff" /><rect x="-5" y="-1.4" width="10" height="2.8" fill="#fff" /></>),
    };
    return <g transform={`translate(${p.x},${p.y})`} style={style}>{map[p.kind] ?? map.poi}</g>;
}

function MapShowcase({ i18n }: { i18n: I18n }) {
    const { msgStr } = i18n;
    const pins = [
        { x: 470, y: 150, kind: "me", delay: 0.2 },
        { x: 640, y: 105, kind: "school", delay: 0.5 },
        { x: 360, y: 205, kind: "memorial", delay: 0.7 },
        { x: 720, y: 200, kind: "friend", delay: 0.9 },
        { x: 250, y: 110, kind: "hazard", delay: 1.1 },
        { x: 560, y: 220, kind: "poi", delay: 1.3 },
        { x: 830, y: 130, kind: "poi2", delay: 1.5 },
    ];
    const friendNm = msgStr("friendNm");
    return (
        <div style={{ position: "relative", height: 280, background: "var(--map-bg)", overflow: "hidden" }}>
            <svg viewBox="0 0 1000 300" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
                <rect width="1000" height="300" fill="var(--map-bg)" />
                {/* water */}
                <path d="M -20 70 Q 240 40 520 95 T 1020 90" stroke="var(--map-water)" strokeWidth="44" fill="none" strokeLinecap="round" />
                {/* parks */}
                <polygon points="590,30 740,55 760,150 620,170" fill="var(--map-park)" />
                <polygon points="120,200 250,215 240,300 110,290" fill="var(--map-park)" />
                {/* minor grid */}
                <g stroke="var(--map-road)" strokeWidth="1" fill="none" opacity="0.8">
                    {[40, 90, 140, 190, 240, 290].map((y) => <line key={"h" + y} x1="-10" y1={y} x2="1010" y2={y} />)}
                    {[80, 160, 240, 320, 400, 480, 560, 640, 720, 800, 880, 960].map((x) => <line key={"v" + x} x1={x} y1="-10" x2={x} y2="310" />)}
                </g>
                {/* major roads */}
                <g fill="none" strokeLinecap="round">
                    <path d="M -20 170 Q 300 150 600 195 T 1020 210" stroke="var(--map-road-2)" strokeWidth="9" />
                    <path d="M -20 170 Q 300 150 600 195 T 1020 210" stroke="var(--map-road)" strokeWidth="5.5" />
                    <path d="M 430 -20 Q 450 150 520 320" stroke="var(--map-road-2)" strokeWidth="9" />
                    <path d="M 430 -20 Q 450 150 520 320" stroke="var(--map-road)" strokeWidth="5.5" />
                </g>
                {/* neighborhood boundary */}
                <path d="M 180 60 L 470 45 L 770 70 L 850 160 L 760 250 L 430 265 L 200 230 L 150 140 Z"
                    fill="var(--accent)" fillOpacity="0.05" stroke="var(--accent)" strokeOpacity="0.55"
                    strokeWidth="2" strokeDasharray="9 6" strokeLinejoin="round" />
                {/* school catchment */}
                <path d="M 560 60 L 740 70 L 770 150 L 660 175 L 555 130 Z"
                    fill="var(--school)" fillOpacity="0.14" stroke="var(--school)" strokeWidth="1.6" strokeDasharray="4 4" strokeLinejoin="round" />
                {/* route */}
                <g fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M 470 150 Q 520 130 560 150 T 720 200" stroke="var(--accent)" strokeWidth="9" opacity="0.18" />
                    <path d="M 470 150 Q 520 130 560 150 T 720 200" stroke="var(--accent)" strokeWidth="4" />
                    <path d="M 470 150 Q 520 130 560 150 T 720 200" stroke="#fff" strokeWidth="1.4" strokeDasharray="6 6">
                        <animate attributeName="stroke-dashoffset" values="0;-24" dur="1.1s" repeatCount="indefinite" />
                    </path>
                </g>
                {/* pins */}
                {pins.map((p, i) => <ShowcasePin key={i} p={p} />)}
            </svg>

            {/* breadcrumb chip */}
            <div style={{
                position: "absolute", top: 12, left: 12, zIndex: 4,
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "var(--bg-panel)", border: "1px solid var(--rule)", borderRadius: 3,
                padding: "6px 10px", fontSize: 12, color: "var(--text)",
                backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
            }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)" }} />
                <b style={{ fontWeight: 600 }}>{msgStr("crumbCity")}</b>
                <span style={{ color: "var(--muted-2)" }}>/</span>
                <span style={{ color: "var(--text-faint)" }}>{msgStr("crumbArea")}</span>
            </div>

            {/* friend toast */}
            <div style={{
                position: "absolute", right: 14, top: 56, zIndex: 4,
                display: "flex", alignItems: "center", gap: 10,
                background: "var(--bg-panel)", border: "1px solid var(--rule)", borderRadius: 3,
                padding: "8px 11px", boxShadow: "0 10px 30px rgba(0,0,0,.35)",
                backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
                animation: "wq-float-in .6s cubic-bezier(.2,.8,.2,1) .9s backwards",
            }}>
                <span style={{ position: "relative", width: 26, height: 26, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0, background: "var(--social)", color: "#2a0f1c" }}>
                    {friendNm.charAt(0)}
                    <span style={{ position: "absolute", right: -1, bottom: -1, width: 8, height: 8, borderRadius: "50%", background: "var(--success)", border: "1.5px solid var(--bg-panel)" }} />
                </span>
                <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.3 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-warm)" }}>{friendNm}</span>
                    <span style={{ fontSize: 10.5, color: "var(--text-faint)" }}>{msgStr("friendSub")}</span>
                </span>
                <span style={{ fontFamily: "var(--mono)", fontSize: 10.5, color: "var(--text-faint)", marginLeft: 4 }}>{msgStr("friendDist")}</span>
            </div>

            {/* memorial toast */}
            <div style={{
                position: "absolute", left: 14, bottom: 16, zIndex: 4,
                display: "flex", alignItems: "center", gap: 10,
                background: "var(--bg-panel)", border: "1px solid var(--rule)", borderRadius: 3,
                padding: "8px 11px", boxShadow: "0 10px 30px rgba(0,0,0,.35)",
                backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
                animation: "wq-float-in .6s cubic-bezier(.2,.8,.2,1) 1.3s backwards",
            }}>
                <span style={{ width: 26, height: 26, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0, background: "var(--memorial)", color: "#1a0e33" }}>✦</span>
                <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.3 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-warm)" }}>{msgStr("memNm")}</span>
                    <span style={{ fontSize: 10.5, color: "var(--text-faint)" }}>{msgStr("memSub")}</span>
                </span>
            </div>
        </div>
    );
}

/* ───────────────────────── score strip ───────────────────────── */
function ScoreStrip({ i18n }: { i18n: I18n }) {
    const { msgStr } = i18n;
    const scores = [
        { k: msgStr("scoreWalk"), v: "92", c: "var(--accent)", w: "92%", raw: false },
        { k: msgStr("scoreTransit"), v: "88", c: "var(--info)", w: "88%", raw: false },
        { k: msgStr("scoreSchools"), v: "7k+", c: "var(--school)", w: "72%", raw: true },
        { k: msgStr("scorePlaces"), v: "12", c: "var(--social)", w: "60%", raw: true },
    ];
    return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderTop: "1px solid var(--rule)" }}>
            {scores.map((s, i) => (
                <div key={i} style={{ padding: "12px 14px", borderRight: i < 3 ? "1px solid var(--rule)" : "none" }}>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-faint)" }}>{s.k}</div>
                    <div style={{ fontFamily: "var(--ui)", fontSize: 22, fontWeight: 600, color: "var(--text-warm)", letterSpacing: "-0.02em", marginTop: 3 }}>
                        {s.v}{!s.raw && <small style={{ fontSize: 12, color: "var(--text-faint)", fontWeight: 400 }}>/100</small>}
                    </div>
                    <div style={{ height: 3, background: "var(--surface-3)", borderRadius: 2, marginTop: 7, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: s.w, background: s.c, borderRadius: 2, transformOrigin: "left", animation: `wq-grow 1s cubic-bezier(.2,.8,.2,1) ${0.3 + i * 0.1}s backwards` }} />
                    </div>
                </div>
            ))}
        </div>
    );
}

/* ───────────────────────── full brand showcase (left panel) ───────────────────────── */
function BrandShowcase({ i18n }: { i18n: I18n }) {
    const { msgStr } = i18n;
    const feats = [
        { h: msgStr("feat1H"), s: msgStr("feat1S"), c: "var(--accent)", ic: "compass" },
        { h: msgStr("feat2H"), s: msgStr("feat2S"), c: "var(--memorial)", ic: "book" },
        { h: msgStr("feat3H"), s: msgStr("feat3S"), c: "var(--social)", ic: "people" },
        { h: msgStr("feat4H"), s: msgStr("feat4S"), c: "var(--info)", ic: "pen" },
    ];
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 26 }}>
            {/* Wordmark */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <QLogo size={30} />
                <span style={{ fontSize: 19, fontWeight: 700, letterSpacing: "-0.01em", color: "var(--text-warm)" }}>
                    whereq<span style={{ color: "var(--accent)" }}>.</span>com
                </span>
                <span style={{
                    marginLeft: 4, fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.12em",
                    textTransform: "uppercase", color: "var(--text-faint)", alignSelf: "center",
                    border: "1px solid var(--rule)", borderRadius: 3, padding: "3px 7px",
                }}>
                    {msgStr("tagMapOs")}
                </span>
            </div>

            {/* Hero */}
            <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 9, fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-faint)" }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 0 3px var(--accent-soft)" }} />
                    {msgStr("brandEyebrow")}
                </div>
                <h1 style={{ margin: "14px 0 0", fontSize: 42, lineHeight: 1.04, fontWeight: 600, letterSpacing: "-0.03em", color: "var(--text-warm)", maxWidth: "14ch" }}>
                    {msgStr("brandH1a")} <span style={{ color: "var(--accent)" }}>{msgStr("brandH1b")}</span>
                </h1>
                <p style={{ margin: "16px 0 0", fontSize: 15, lineHeight: 1.6, color: "var(--text-dim)", maxWidth: "46ch" }}>
                    {msgStr("brandSub")}
                </p>
            </div>

            {/* Showcase card */}
            <div style={{ position: "relative", background: "var(--bg-panel)", border: "1px solid var(--rule)", borderRadius: 5, overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", borderBottom: "1px solid var(--rule)", background: "var(--surface-2)" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 9, fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-dim)" }}>
                        <span style={{ width: 3, height: 13, background: "var(--accent)", borderRadius: 1 }} />
                        {msgStr("cardBar")}
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "var(--mono)", fontSize: 10.5, color: "var(--text-faint)" }}>
                        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--success)", boxShadow: "0 0 0 3px rgba(74,222,128,.18)", animation: "fd-ticker-pulse 2s ease-in-out infinite" }} />
                        {msgStr("inView")}
                    </span>
                </div>
                <MapShowcase i18n={i18n} />
                <ScoreStrip i18n={i18n} />
            </div>

            {/* Feature grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 28px" }}>
                {feats.map((f, i) => (
                    <div key={i} style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
                        <span style={{ width: 28, height: 28, borderRadius: 3, flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", background: f.c, color: "var(--accent-ink)" }}>
                            {FeatIc[f.ic]}
                        </span>
                        <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-warm)" }}>{f.h}</span>
                            <span style={{ fontSize: 11.5, lineHeight: 1.45, color: "var(--text-faint)" }}>{f.s}</span>
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ── Shield icon ── */
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
            <h2 style={{ margin: "0 0 4px", fontSize: "26px", fontWeight: 600, letterSpacing: "-0.01em", color: "var(--text-warm)" }}>
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
