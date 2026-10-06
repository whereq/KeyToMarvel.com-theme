import type { I18n } from "./i18n";
import { WhereQCloudWordmark } from "@keycloak-theme/shared/ui";

type MsgKey = Parameters<I18n["msgStr"]>[0];

/** Metro tile grid — market-data product surfaces, matching the brand design 1:1. */
const TILES = [
    { titleKey: "tileNews", path: "/v1/news", bg: "var(--wqc-tile-teal)", fg: "#ffffff", span: "span 2" },
    { titleKey: "tileFlash", path: "/v1/flash", bg: "var(--wqc-tile-red)", fg: "#ffffff", span: "span 1" },
    { titleKey: "tileHot", path: "/v1/hotstocks", bg: "var(--wqc-tile-amber)", fg: "#1d1d1d", span: "span 1" },
    { titleKey: "tileQuotes", path: "/v1/quotes", bg: "var(--wqc-tile-green)", fg: "#ffffff", span: "span 1" },
    { titleKey: "tileEcon", path: "/v1/econ-calendar", bg: "var(--wqc-tile-dark)", fg: "#ffffff", span: "span 1" },
    { titleKey: "tileNova", path: "nova", bg: "var(--wqc-tile-purple)", fg: "#ffffff", span: "span 2" },
] as const;

/**
 * WqcBrandPanel — the navy/blue aside panel from the whereq.cloud Keycloak
 * sign-in brand design: wordmark + live badge, eyebrow/headline/body copy,
 * a 6-tile Metro product grid, and a 4-stat row. Content is realm-level (not
 * per-view), so the same panel is reused across login, register and
 * forgot-password.
 */
export default function WqcBrandPanel({ i18n }: { i18n: I18n }) {
    const { msgStr } = i18n;

    const stats = [
        { value: "22K+", labelKey: "statInstruments" },
        { value: "15", labelKey: "statExchanges" },
        { value: "8.6M+", labelKey: "statQuotes" },
        { value: "6", labelKey: "statResources" },
    ] as const;

    return (
        <>
            <div className="flex items-center justify-between gap-4">
                <WhereQCloudWordmark height={32} onInvert />
                <div
                    className="flex items-center gap-2 shrink-0"
                    style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#e3eefa" }}
                >
                    <span style={{ width: "8px", height: "8px", background: "var(--wqc-live)", display: "block" }} />
                    {msgStr("brandLive" as MsgKey)}
                </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "18px", maxWidth: "560px" }}>
                <span style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#cfe2f6" }}>
                    {msgStr("brandEyebrow" as MsgKey)}
                </span>
                <h1 style={{ margin: 0, fontSize: "40px", lineHeight: 1.1, fontWeight: 300, letterSpacing: "-0.01em", color: "#ffffff" }}>
                    {msgStr("brandHeadline" as MsgKey)}{" "}
                    <span style={{ fontWeight: 600 }}>{msgStr("brandHeadlineBold" as MsgKey)}</span>
                </h1>
                <p style={{ margin: 0, fontSize: "15px", lineHeight: 1.6, color: "#e3eefa" }}>
                    {msgStr("brandBody" as MsgKey)}
                </p>
            </div>

            <div className="wqc-tile-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gridAutoRows: "88px", gap: "6px" }}>
                {TILES.map(tile => (
                    <div
                        key={tile.path}
                        style={{
                            gridColumn: tile.span,
                            background: tile.bg,
                            color: tile.fg,
                            borderRadius: "var(--wqc-r-xs)",
                            padding: "12px 14px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            gap: "4px",
                            overflow: "hidden",
                        }}
                    >
                        <span style={{ font: "500 11px var(--wqc-font-mono)", opacity: 0.9 }}>{tile.path}</span>
                        <span style={{ fontSize: "14px", fontWeight: 600, lineHeight: 1.2 }}>{msgStr(tile.titleKey as MsgKey)}</span>
                    </div>
                ))}
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                    gap: "16px",
                    borderTop: "1px solid rgba(255,255,255,.22)",
                    paddingTop: "20px",
                }}
            >
                {stats.map(stat => (
                    <div key={stat.labelKey} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <span style={{ fontSize: "24px", fontWeight: 300, lineHeight: 1, color: "#ffffff" }}>{stat.value}</span>
                        <span style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color: "#cfe2f6" }}>
                            {msgStr(stat.labelKey as MsgKey)}
                        </span>
                    </div>
                ))}
            </div>
        </>
    );
}
