import { useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import type { FdTemplateProps } from "@keycloak-theme/layout/Template";
import { FdDivider, FlowDeskLogo } from "@keycloak-theme/shared/ui";
import LoginForm from "./LoginForm";
import SocialProviders from "./SocialProviders";

/* ── Mock market data for the brand panel ── */
const MARKET_TICKERS = [
    { symbol: "NVDA",  price: "875.32", change: "+3.74%",  up: true  },
    { symbol: "AAPL",  price: "182.41", change: "+1.18%",  up: true  },
    { symbol: "TSLA",  price: "251.09", change: "-0.83%",  up: false },
    { symbol: "MSFT",  price: "415.87", change: "+0.52%",  up: true  },
] as const;

/* ── Animated stock sparkline chart (pure SVG) ── */
function StockSparkline() {
    // A rising trendline with realistic micro-volatility
    const linePath =
        "M0,85 L12,80 L24,72 L36,78 L48,65 L60,70 L72,58 L84,62 L96,50 L108,55 " +
        "L120,42 L132,48 L144,35 L156,40 L168,30 L180,36 L192,22 L204,28 L216,18 " +
        "L228,24 L240,12 L252,18 L264,8 L276,14 L288,5 L300,10";

    const areaPath =
        "M0,85 L12,80 L24,72 L36,78 L48,65 L60,70 L72,58 L84,62 L96,50 L108,55 " +
        "L120,42 L132,48 L144,35 L156,40 L168,30 L180,36 L192,22 L204,28 L216,18 " +
        "L228,24 L240,12 L252,18 L264,8 L276,14 L288,5 L300,10 L300,100 L0,100 Z";

    return (
        <div style={{ width: "100%", position: "relative" }}>
            {/* Chart header */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "6px",
                }}
            >
                <span style={{ fontSize: "0.7rem", color: "var(--fd-text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Market Overview — Today
                </span>
                <span
                    style={{
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        color: "var(--fd-stock-green)",
                        background: "var(--fd-stock-green-bg)",
                        padding: "1px 6px",
                    }}
                >
                    ▲ 2.14%
                </span>
            </div>

            <svg
                viewBox="0 0 300 100"
                width="100%"
                height="80"
                preserveAspectRatio="none"
                style={{ display: "block", overflow: "visible" }}
            >
                <defs>
                    <linearGradient id="fd-area-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0078d4" stopOpacity="0.18" />
                        <stop offset="100%" stopColor="#0078d4" stopOpacity="0" />
                    </linearGradient>
                    {/* Grid line pattern */}
                    <pattern id="fd-grid" x="0" y="0" width="60" height="25" patternUnits="userSpaceOnUse">
                        <line x1="0" y1="0" x2="0" y2="100" stroke="var(--fd-border-subtle)" strokeWidth="0.5" />
                    </pattern>
                </defs>

                {/* Horizontal grid lines */}
                <line x1="0" y1="25" x2="300" y2="25" stroke="var(--fd-border-subtle)" strokeWidth="0.5" />
                <line x1="0" y1="50" x2="300" y2="50" stroke="var(--fd-border-subtle)" strokeWidth="0.5" />
                <line x1="0" y1="75" x2="300" y2="75" stroke="var(--fd-border-subtle)" strokeWidth="0.5" />

                {/* Area fill */}
                <path d={areaPath} fill="url(#fd-area-grad)" />

                {/* Price line — animated draw-in */}
                <path
                    d={linePath}
                    stroke="#0078d4"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="square"
                    style={{
                        strokeDasharray: "800",
                        strokeDashoffset: "800",
                        animation: "fd-draw-line 2s ease-out 0.3s forwards",
                    }}
                />

                {/* Cyan highlight on the last point */}
                <circle
                    cx="300"
                    cy="10"
                    r="2.5"
                    fill="#00bcf2"
                    style={{ animation: "fd-fade-in 0.3s ease 2.2s both" }}
                />
                {/* Pulse ring */}
                <circle
                    cx="300"
                    cy="10"
                    r="5"
                    fill="none"
                    stroke="#00bcf2"
                    strokeWidth="1"
                    opacity="0.4"
                    style={{ animation: "fd-fade-in 0.3s ease 2.2s both" }}
                />
            </svg>

            {/* Time axis labels */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "2px",
                }}
            >
                {["9:30", "11:00", "12:30", "14:00", "15:30", "Close"].map(t => (
                    <span key={t} style={{ fontSize: "0.62rem", color: "var(--fd-text-muted)" }}>
                        {t}
                    </span>
                ))}
            </div>
        </div>
    );
}

/* ── Candlestick mini chart ── */
function CandlestickBar({
    x, high, low, open, close, width = 8,
}: {
    x: number; high: number; low: number; open: number; close: number; width?: number;
}) {
    const isUp = close <= open; // SVG y-axis inverted
    const color = isUp ? "var(--fd-stock-green)" : "var(--fd-stock-red)";
    const bodyTop = Math.min(open, close);
    const bodyH = Math.abs(open - close) || 1;

    return (
        <g>
            {/* Wick */}
            <line x1={x} y1={high} x2={x} y2={low} stroke={color} strokeWidth="1" />
            {/* Body */}
            <rect
                x={x - width / 2}
                y={bodyTop}
                width={width}
                height={bodyH}
                fill={color}
                style={{ animation: "fd-candle-rise 0.4s ease both" }}
            />
        </g>
    );
}

function CandlestickChart() {
    // Pre-computed candlestick data (y-axis: 0=top, 100=bottom)
    const candles = [
        { x: 15,  high: 72, low: 88, open: 86, close: 78 },
        { x: 33,  high: 65, low: 82, open: 78, close: 68 },
        { x: 51,  high: 60, low: 75, open: 70, close: 62 },
        { x: 69,  high: 55, low: 70, open: 68, close: 58 },
        { x: 87,  high: 50, low: 65, open: 62, close: 52 },
        { x: 105, high: 48, low: 62, open: 55, close: 50 },
        { x: 123, high: 44, low: 56, open: 54, close: 46 },
        { x: 141, high: 40, low: 52, open: 50, close: 42 },
        { x: 159, high: 38, low: 50, open: 48, close: 62 }, // red candle
        { x: 177, high: 36, low: 48, open: 40, close: 38 },
        { x: 195, high: 30, low: 44, open: 42, close: 32 },
        { x: 213, high: 25, low: 38, open: 36, close: 27 },
        { x: 231, high: 22, low: 35, open: 30, close: 24 },
        { x: 249, high: 18, low: 30, open: 28, close: 20 },
        { x: 267, high: 14, low: 25, open: 23, close: 16 },
        { x: 285, high: 10, low: 22, open: 20, close: 12 },
    ];

    return (
        <svg viewBox="0 0 300 100" width="100%" height="60" preserveAspectRatio="none">
            {/* Grid */}
            <line x1="0" y1="25" x2="300" y2="25" stroke="var(--fd-border-subtle)" strokeWidth="0.5" />
            <line x1="0" y1="50" x2="300" y2="50" stroke="var(--fd-border-subtle)" strokeWidth="0.5" />
            <line x1="0" y1="75" x2="300" y2="75" stroke="var(--fd-border-subtle)" strokeWidth="0.5" />

            {candles.map((c, i) => (
                <CandlestickBar key={i} {...c} />
            ))}
        </svg>
    );
}

/* ── Market ticker row — 2×2 grid ── */
function MarketTicker() {
    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "2px",
                width: "100%",
            }}
        >
            {MARKET_TICKERS.map(({ symbol, price, change, up }) => (
                <div
                    key={symbol}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "5px 10px",
                        background: "var(--fd-bg-elevated)",
                        borderLeft: `2px solid ${up ? "var(--fd-stock-green)" : "var(--fd-stock-red)"}`,
                    }}
                >
                    <span
                        style={{
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            color: "var(--fd-text-primary)",
                            fontFamily: "var(--fd-font-mono)",
                            letterSpacing: "0.05em",
                        }}
                    >
                        {symbol}
                    </span>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "1px" }}>
                        <span
                            style={{
                                fontSize: "0.72rem",
                                color: "var(--fd-text-secondary)",
                                fontFamily: "var(--fd-font-mono)",
                            }}
                        >
                            ${price}
                        </span>
                        <span
                            style={{
                                fontSize: "0.68rem",
                                fontWeight: 600,
                                color: up ? "var(--fd-stock-green)" : "var(--fd-stock-red)",
                                fontFamily: "var(--fd-font-mono)",
                            }}
                        >
                            {change}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}

/* ── Full brand panel ── */
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
                alignItems: "flex-start",
                gap: "20px",
                width: "100%",
                position: "relative",
                zIndex: 1,
            }}
        >
            {/* Logo + name: horizontal wordmark */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <FlowDeskLogo size={48} showBackground={false} />
                    <h2
                        style={{
                            margin: 0,
                            fontSize: "2rem",
                            fontWeight: 700,
                            letterSpacing: "-0.02em",
                            lineHeight: 1,
                            background: "linear-gradient(90deg, #0078d4 0%, #00bcf2 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                        }}
                    >
                        FlowDesk
                    </h2>
                </div>
                <p
                    style={{
                        margin: 0,
                        fontSize: "0.9rem",
                        color: "var(--fd-text-secondary)",
                        lineHeight: 1.4,
                        whiteSpace: "nowrap",
                    }}
                >
                    {msgStr("brandTagline")}
                </p>
            </div>

            {/* Line chart */}
            <div
                style={{
                    width: "100%",
                    padding: "12px 14px 8px",
                    background: "rgba(0, 120, 212, 0.04)",
                    border: "1px solid var(--fd-border-subtle)",
                    borderTop: "2px solid var(--fd-blue-500)",
                }}
            >
                <StockSparkline />
            </div>

            {/* Candlestick mini chart */}
            <div
                style={{
                    width: "100%",
                    padding: "8px 14px 6px",
                    background: "var(--fd-bg-elevated)",
                    border: "1px solid var(--fd-border-subtle)",
                }}
            >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span style={{ fontSize: "0.68rem", color: "var(--fd-text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                        Daily Candles
                    </span>
                    <span style={{ fontSize: "0.68rem", color: "var(--fd-cyan-400)", fontFamily: "var(--fd-font-mono)" }}>
                        NVDA · 1D
                    </span>
                </div>
                <CandlestickChart />
            </div>

            {/* Live market tickers */}
            <div style={{ width: "100%" }}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "6px",
                        paddingLeft: "2px",
                    }}
                >
                    <span style={{ fontSize: "0.68rem", color: "var(--fd-text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                        Live Quotes
                    </span>
                    <span
                        style={{
                            fontSize: "0.68rem",
                            color: "var(--fd-stock-green)",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                        }}
                    >
                        <span
                            style={{
                                display: "inline-block",
                                width: "5px",
                                height: "5px",
                                borderRadius: "50%",
                                background: "var(--fd-stock-green)",
                                animation: "fd-ticker-pulse 2s ease-in-out infinite",
                            }}
                        />
                        Market Open
                    </span>
                </div>
                <MarketTicker />
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
                            padding: "6px 10px",
                            color: "var(--fd-text-secondary)",
                            fontSize: "0.82rem",
                        }}
                    >
                        <span
                            style={{
                                width: "4px",
                                height: "4px",
                                background: "var(--fd-blue-500)",
                                flexShrink: 0,
                                display: "inline-block",
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

    const Template = props.Template as React.ComponentType<FdTemplateProps>;

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
                <span style={{ color: "var(--fd-text-secondary)" }}>
                    {msg("noAccount")}{" "}
                    <a
                        href={kcContext.url.registrationUrl}
                        style={{ color: "var(--fd-blue-500)", fontWeight: 500 }}
                    >
                        {msg("doRegister")}
                    </a>
                </span>
            }
            layoutVariant="split"
            leftPanelNode={<BrandPanel i18n={i18n} />}
        >
            {/* Social providers first */}
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
                <FdDivider>{msg("or")}</FdDivider>
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
