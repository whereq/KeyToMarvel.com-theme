import type { I18n } from "./i18n";
import { QHaulWordmark } from "@keycloak-theme/shared/ui";
import mascotUrl from "@keycloak-theme/shared/assets/qhaul-mascot-thumbup.png";

type MsgKey = Parameters<I18n["msgStr"]>[0];

/** Stat tile palette, matching the brand design's 2x2 orange/navy/teal/white grid. */
const TILE_STYLE = [
    { bg: "var(--qh-tile-1-bg)", ink: "var(--qh-tile-1-ink)" },
    { bg: "var(--qh-tile-2-bg)", ink: "var(--qh-tile-2-ink)" },
    { bg: "var(--qh-tile-3-bg)", ink: "var(--qh-tile-3-ink)" },
    { bg: "var(--qh-tile-4-bg)", ink: "var(--qh-tile-4-ink)" },
] as const;

/**
 * QhBrandPanel — the navy aside panel from the QHaul Keycloak sign-in brand
 * design: wordmark, realm eyebrow, headline/body copy, 2x2 stat tiles, and
 * the mascot illustration. Content is realm-level (not per-view), so the same
 * panel is reused across login, register and forgot-password.
 */
export default function QhBrandPanel({ i18n }: { i18n: I18n }) {
    const { msgStr } = i18n;

    const eyebrow = msgStr("brandRealm" as MsgKey);
    const headline = msgStr("brandHeadline" as MsgKey);
    const body = msgStr("brandBody" as MsgKey);

    const tiles = [
        { value: msgStr("brandTile1Value" as MsgKey), label: msgStr("brandTile1Label" as MsgKey) },
        { value: msgStr("brandTile2Value" as MsgKey), label: msgStr("brandTile2Label" as MsgKey) },
        { value: msgStr("brandTile3Value" as MsgKey), label: msgStr("brandTile3Label" as MsgKey) },
        { value: msgStr("brandTile4Value" as MsgKey), label: msgStr("brandTile4Label" as MsgKey) },
    ];

    return (
        <>
            <QHaulWordmark height={30} />

            <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "8px" }}>
                <span
                    style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: "var(--qh-navy-eyebrow)",
                    }}
                >
                    {eyebrow}
                </span>
                <h1
                    style={{
                        margin: 0,
                        fontSize: "36px",
                        lineHeight: 1.14,
                        fontWeight: 700,
                        maxWidth: "22ch",
                        color: "var(--qh-navy-ink)",
                    }}
                >
                    {headline}
                </h1>
                <p
                    style={{
                        margin: 0,
                        fontSize: "16px",
                        lineHeight: 1.6,
                        color: "var(--qh-navy-ink-2)",
                        maxWidth: "42ch",
                    }}
                >
                    {body}
                </p>
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: "2px",
                    maxWidth: "440px",
                    marginTop: "4px",
                }}
            >
                {tiles.map((tile, i) => (
                    <div
                        key={tile.label}
                        style={{
                            background: TILE_STYLE[i].bg,
                            color: TILE_STYLE[i].ink,
                            padding: "16px 16px 14px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "4px",
                        }}
                    >
                        <span style={{ fontSize: "20px", fontWeight: 700, lineHeight: 1.1 }}>{tile.value}</span>
                        <span
                            style={{
                                fontSize: "11px",
                                fontWeight: 700,
                                letterSpacing: "0.09em",
                                textTransform: "uppercase",
                                opacity: 0.85,
                            }}
                        >
                            {tile.label}
                        </span>
                    </div>
                ))}
            </div>

            <div style={{ flex: "1 1 auto" }} />

            <img
                src={mascotUrl}
                alt=""
                style={{
                    height: "280px",
                    width: "auto",
                    display: "block",
                    alignSelf: "flex-end",
                    marginRight: "-8px",
                    marginBottom: "-12px",
                }}
            />

            <span
                style={{
                    position: "absolute",
                    left: 0,
                    bottom: 0,
                    width: "100%",
                    height: "6px",
                    background: "var(--qh-accent)",
                }}
            />
        </>
    );
}
