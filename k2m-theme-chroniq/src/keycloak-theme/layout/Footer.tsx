import type { I18n } from "./i18n";

interface FooterProps {
    i18n: I18n;
}

/**
 * Footer — Chroniq Metro bottom bar.
 *
 * Left: green status dot + "All systems operational"
 * Right: "© 2026 chroniq.cc · All rights reserved."
 * Mono font, uppercase, 11px.
 */
export default function Footer({ i18n }: FooterProps) {
    const { msgStr } = i18n;

    return (
        <footer
            id="cq-footer"
            className="fixed bottom-0 left-0 right-0 flex items-center justify-between px-6"
            style={{
                height: "36px",
                background: "var(--cq-surface)",
                borderTop: "1px solid var(--cq-border)",
                fontFamily: "var(--cq-font-mono)",
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "var(--cq-muted)",
            }}
        >
            {/* Status */}
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span
                    style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "var(--cq-tile-emerald)",
                        flexShrink: 0,
                        animation: "cq-pulse-dot 3s ease-in-out infinite",
                    }}
                />
                {msgStr("footerStatus" as Parameters<typeof msgStr>[0])}
            </span>

            {/* Copyright */}
            <span>
                {msgStr("footerCopyright" as Parameters<typeof msgStr>[0])}
            </span>
        </footer>
    );
}
