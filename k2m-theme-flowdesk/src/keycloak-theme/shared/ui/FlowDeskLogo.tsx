import type { CSSProperties } from "react";

interface FlowDeskLogoProps {
    size?: number;
    style?: CSSProperties;
    className?: string;
    /** Show background rect (default true for standalone use) */
    showBackground?: boolean;
}

/**
 * FlowDeskLogo — the canonical "F + data-flow" SVG mark.
 *
 * F-shaped letterform in Metro Blue with two cyan data-flow curves beneath,
 * representing the continuous flow of market data.
 */
export function FlowDeskLogo({
    size = 40,
    style,
    className,
    showBackground = true,
}: FlowDeskLogoProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 40 40"
            width={size}
            height={size}
            style={style}
            className={className}
            role="img"
            aria-label="FlowDesk logo"
        >
            {showBackground && <rect width="40" height="40" fill="#0d0d0d" />}
            {/* F vertical stem */}
            <rect x="8" y="7" width="4" height="26" fill="#0078d4" />
            {/* F top horizontal bar */}
            <rect x="8" y="7" width="17" height="4" fill="#0078d4" />
            {/* F middle horizontal bar */}
            <rect x="8" y="17" width="13" height="4" fill="#0078d4" />
            {/* Primary data-flow curve */}
            <path
                d="M12 34 Q20 28 26 30 Q32 32 36 26"
                stroke="#00bcf2"
                strokeWidth="1.5"
                strokeLinecap="square"
                fill="none"
                opacity="0.85"
            />
            {/* Secondary data-flow curve (subtle) */}
            <path
                d="M12 37 Q22 32 30 34 Q36 36 38 31"
                stroke="#00bcf2"
                strokeWidth="1"
                strokeLinecap="square"
                fill="none"
                opacity="0.4"
            />
            {/* Data node dot */}
            <circle cx="26" cy="30" r="1.5" fill="#00bcf2" opacity="0.9" />
        </svg>
    );
}

/**
 * FlowDeskWordmark — logo mark + "FlowDesk" text lockup.
 */
export function FlowDeskWordmark({
    size = 32,
    style,
    className,
}: {
    size?: number;
    style?: CSSProperties;
    className?: string;
}) {
    return (
        <div
            className={["flex items-center gap-2.5", className ?? ""].join(" ")}
            style={style}
        >
            <FlowDeskLogo size={size} showBackground={false} />
            <span
                style={{
                    fontSize: `${Math.round(size * 0.45)}px`,
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                    background: "linear-gradient(90deg, #0078d4 0%, #00bcf2 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    lineHeight: 1,
                    userSelect: "none",
                }}
            >
                FlowDesk
            </span>
        </div>
    );
}
