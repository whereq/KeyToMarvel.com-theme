import { useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import type { FdTemplateProps } from "@keycloak-theme/layout/Template";
import { FdDivider } from "@keycloak-theme/shared/ui";
import LoginForm from "./LoginForm";
import SocialProviders from "./SocialProviders";

/* ── Mock data ── */
const TICKERS = [
    { sym: "NVDA", px: "875.32", ch: "+3.74%", up: true  },
    { sym: "AAPL", px: "182.41", ch: "+1.18%", up: true  },
    { sym: "TSLA", px: "251.09", ch: "−0.83%", up: false },
    { sym: "MSFT", px: "415.87", ch: "+0.52%", up: true  },
] as const;

/* ── Deterministic PRNG (same seed = same chart every render) ── */
function rng(seed: number) {
    let s = seed * 9301 + 49297;
    return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}

/* ── Pre-compute sparkline path (module-level, deterministic) ── */
const SPARK = (() => {
    const W = 800, H = 120, pad = 6;
    const r = rng(11); const n = 60; const pts: number[] = []; let v = 30;
    for (let i = 0; i < n; i++) { v += (r() - 0.42) * 6; pts.push(v); }
    const min = Math.min(...pts), max = Math.max(...pts);
    const nx = (i: number) => pad + (i / (n - 1)) * (W - pad * 2);
    const ny = (p: number) => H - pad - ((p - min) / (max - min || 1)) * (H - pad * 2 - 8);
    let d = ""; pts.forEach((p, i) => { d += (i ? "L" : "M") + nx(i).toFixed(1) + " " + ny(p).toFixed(1) + " "; });
    const area = d + `L${(W - pad).toFixed(1)} ${H} L${pad} ${H} Z`;
    const lastX = nx(n - 1), lastY = ny(pts[n - 1]);
    return { d, area, lastX, lastY };
})();

/* ── Pre-compute candlestick data ── */
type Candle = { open: number; close: number; high: number; low: number };
const CANDLES = (() => {
    const n = 22;
    const r = rng(7); let close = 46; const data: Candle[] = [];
    for (let i = 0; i < n; i++) {
        const open = close; close = open + (r() - 0.4) * 7;
        const high = Math.max(open, close) + r() * 4 + 1;
        const low  = Math.min(open, close) - r() * 4 - 1;
        data.push({ open, high, low, close });
    }
    return data;
})();

/* ── Panel header row ── */
function PanelH({ label, right }: { label: string; right?: React.ReactNode }) {
    return (
        <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "9px 12px", borderBottom: "1px solid var(--rule)",
            fontSize: "10px", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase",
            color: "var(--text-dim)", fontFamily: "var(--mono)",
        }}>
            <span style={{ width: 3, height: 10, background: "var(--accent)", borderRadius: 1, flexShrink: 0 }} />
            <span>{label}</span>
            {right && <><span style={{ flex: 1 }} />{right}</>}
        </div>
    );
}

/* ── Market overview sparkline ── */
function Sparkline() {
    const { d, area, lastX, lastY } = SPARK;
    return (
        <div style={{ padding: "12px 12px 10px" }}>
            <svg width="100%" height="100" viewBox="0 0 800 120" preserveAspectRatio="none" style={{ display: "block" }}>
                <defs>
                    <linearGradient id="fd-sg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.20" />
                        <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                    </linearGradient>
                </defs>
                <path d={area} fill="url(#fd-sg)" />
                <path d={d} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                <circle cx={lastX} cy={lastY} r="4" fill="var(--accent)" />
                <circle cx={lastX} cy={lastY} r="8" fill="var(--accent)" opacity="0.18" />
            </svg>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontFamily: "var(--mono)", fontSize: "9.5px", color: "var(--text-faint)" }}>
                {["09:30", "11:00", "12:30", "14:00", "15:30", "Close"].map(t => <span key={t}>{t}</span>)}
            </div>
        </div>
    );
}

/* ── Daily candlestick chart ── */
function Candlesticks() {
    const W = 800, H = 92, pad = 8;
    const data = CANDLES;
    const all = data.flatMap(d => [d.high, d.low]);
    const min = Math.min(...all), max = Math.max(...all);
    const span = (W - pad * 2) / data.length;
    const ny = (v: number) => pad + (1 - (v - min) / (max - min || 1)) * (H - pad * 2);

    return (
        <div style={{ padding: "10px 12px 8px" }}>
            <svg width="100%" height="70" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
                {data.map((c, i) => {
                    const x = pad + i * span + span / 2;
                    const upC = c.close >= c.open;
                    const col = upC ? "var(--up)" : "var(--down)";
                    const yo = ny(c.open), yc = ny(c.close);
                    const yt = Math.min(yo, yc), hgt = Math.max(2, Math.abs(yc - yo));
                    const bw = Math.max(3, span * 0.52);
                    return (
                        <g key={i}>
                            <line x1={x.toFixed(1)} y1={ny(c.high).toFixed(1)} x2={x.toFixed(1)} y2={ny(c.low).toFixed(1)} stroke={col} strokeWidth="1.2" />
                            <rect x={(x - bw / 2).toFixed(1)} y={yt.toFixed(1)} width={bw.toFixed(1)} height={hgt.toFixed(1)} rx="0.5" fill={col} />
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}

/* ── Live quotes 2×2 grid ── */
function Quotes() {
    return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
            {TICKERS.map(({ sym, px, ch, up }, i) => (
                <div key={sym} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "11px 12px",
                    borderTop: i < 2 ? "none" : "1px solid var(--rule)",
                    borderRight: i % 2 === 0 ? "1px solid var(--rule)" : "none",
                    borderLeft: `2px solid ${up ? "var(--up)" : "var(--down)"}`,
                }}>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 12, fontWeight: 600, letterSpacing: "0.04em" }}>{sym}</span>
                    <div style={{ textAlign: "right" }}>
                        <div style={{ fontFamily: "var(--mono)", fontSize: 13 }}>${px}</div>
                        <div style={{ fontFamily: "var(--mono)", fontSize: 10.5, color: up ? "var(--up)" : "var(--down)", fontWeight: 500 }}>{ch}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}

/* ── Terminal status line ── */
function StatusLine() {
    return (
        <div style={{
            marginTop: "auto", display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap",
            padding: "11px 0", borderTop: "1px solid var(--rule)",
            fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.05em", color: "var(--text-dim)",
        }}>
            {[
                { dot: "var(--up)",     label: "MARKET · OPEN", sub: "NY 14:22 EDT" },
                { dot: "var(--nova)",   label: "NOVA · READY",  sub: "v0.4-preview" },
                { dot: "var(--accent)", label: "DATA · NEAR-RT", sub: "lag 0.8s"    },
            ].map(({ dot, label, sub }) => (
                <span key={label} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: dot, display: "inline-block", animation: "fd-ticker-pulse 2s ease-in-out infinite" }} />
                    <span style={{ color: "var(--text)" }}>{label}</span>
                    <span style={{ color: "var(--text-faint)" }}>{sub}</span>
                </span>
            ))}
        </div>
    );
}

/* ── Full brand showcase (left panel) ── */
function BrandShowcase({ i18n }: { i18n: I18n }) {
    const { msgStr } = i18n;
    const panel: React.CSSProperties = {
        border: "1px solid var(--rule)",
        background: "var(--bg-panel)",
        borderRadius: 5,
    };
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%", paddingBottom: 0 }}>
            {/* Wordmark */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}>
                <svg viewBox="0 0 56 56" fill="none" width="34" height="34" style={{ color: "var(--text)", flexShrink: 0 }}>
                    <rect x="7" y="4" width="5" height="48" rx="1.5" fill="currentColor"/>
                    <line x1="18" y1="11" x2="18" y2="22" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                    <rect x="15.5" y="14" width="5" height="6" rx="0.5" fill="currentColor"/>
                    <line x1="27" y1="7" x2="27" y2="21" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                    <rect x="24.5" y="9" width="5" height="10" rx="0.5" fill="none" stroke="currentColor" strokeWidth="1.4"/>
                    <line x1="36" y1="3" x2="36" y2="18" stroke="var(--accent)" strokeWidth="1.4" strokeLinecap="round"/>
                    <rect x="33.5" y="5" width="5" height="10" rx="0.5" fill="var(--accent)"/>
                    <line x1="45" y1="2" x2="45" y2="13" stroke="var(--accent)" strokeWidth="1.4" strokeLinecap="round"/>
                    <rect x="42.5" y="3" width="5" height="7" rx="0.5" fill="var(--accent)"/>
                    <rect x="7" y="29" width="22" height="9" rx="1" fill="currentColor"/>
                    <circle cx="9.5" cy="48" r="2.5" fill="var(--accent)"/>
                </svg>
                <span style={{ fontSize: 19, fontWeight: 700, letterSpacing: "-0.01em" }}>
                    Flow<span style={{ opacity: 0.55 }}>Desk</span>
                </span>
                <span style={{ marginLeft: 6, fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.12em", color: "var(--text-faint)", alignSelf: "center" }}>
                    DEEP STOCK ANALYSIS
                </span>
            </div>

            {/* Lede */}
            <div style={{ marginBottom: 26 }}>
                <h1 style={{ margin: "0 0 12px", fontSize: 33, fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.12, maxWidth: "16ch" }}>
                    {msgStr("brandTagline")}
                </h1>
                <p style={{ margin: 0, color: "var(--text-dim)", fontSize: 15, lineHeight: 1.5, maxWidth: "44ch" }}>
                    {msgStr("brandSubline")}
                </p>
            </div>

            {/* Charts & quotes */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1, minHeight: 0 }}>
                {/* Market overview */}
                <div style={panel}>
                    <PanelH label={msgStr("mktOverview")} right={<span style={{ fontFamily: "var(--mono)", fontWeight: 500, letterSpacing: "0.08em", color: "var(--up)", fontSize: 10 }}>▲ +2.14%</span>} />
                    <Sparkline />
                </div>

                {/* Daily candles */}
                <div style={panel}>
                    <PanelH label={msgStr("dailyCandles")} right={<span style={{ fontFamily: "var(--mono)", fontWeight: 500, letterSpacing: "0.08em", color: "var(--text-faint)", fontSize: 10 }}>NVDA · 1D</span>} />
                    <Candlesticks />
                </div>

                {/* Live quotes */}
                <div style={panel}>
                    <PanelH
                        label={msgStr("liveQuotes")}
                        right={
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--mono)", fontSize: 10, color: "var(--up)" }}>
                                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--up)", display: "inline-block", animation: "fd-ticker-pulse 2s ease-in-out infinite" }} />
                                {msgStr("mktOpen")}
                            </span>
                        }
                    />
                    <Quotes />
                </div>
            </div>

            {/* Feature bullets */}
            <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 11 }}>
                {[msgStr("brandBullet1"), msgStr("brandBullet2"), msgStr("brandBullet3")].map(text => (
                    <div key={text} style={{ display: "flex", alignItems: "center", gap: 11, color: "var(--text-dim)", fontSize: "13.5px" }}>
                        <span style={{ width: 5, height: 5, background: "var(--accent)", borderRadius: 1, flexShrink: 0, display: "inline-block" }} />
                        {text}
                    </div>
                ))}
            </div>

            <StatusLine />
        </div>
    );
}

/* ── Shield icon ── */
const ShieldIcon = (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3 4 6v6c0 4 3 7.5 8 9 5-1.5 8-5 8-9V6z"/>
    </svg>
);

/* ── Arrow icon for submit button ── */
const ArrowIcon = (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
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
            <h2 style={{ margin: "0 0 4px", fontSize: "26px", fontWeight: 600, letterSpacing: "-0.01em", color: "var(--text)" }}>
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
