import { type CSSProperties, useState } from "react";

interface ChroniqLogoProps {
    size?: number;
    style?: CSSProperties;
    className?: string;
}

/**
 * ChroniqBrandMark — cartoon calendar SVG with animated Q mark.
 *
 * Features:
 * - Two binding rings (top)
 * - Calendar page body with coral header strip
 * - Circle "Q" shape in accent color
 * - Q tail line with animated dash
 * - Amber "today" tile inside Q (pulsing)
 * - Gentle bob animation (7s), hover shake
 */
export function ChroniqBrandMark({ size = 36, style, className }: ChroniqLogoProps) {
    const [hovered, setHovered] = useState(false);

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 36 36"
            width={size}
            height={size}
            style={{
                ...style,
                animation: hovered
                    ? "cq-logo-shake 0.4s ease"
                    : "cq-bob 7s ease-in-out infinite",
                cursor: "default",
            }}
            className={className}
            role="img"
            aria-label="chroniq logo"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Binding rings */}
            <rect x="10" y="2" width="3" height="7" rx="1.5" fill="var(--cq-border-strong)" />
            <rect x="23" y="2" width="3" height="7" rx="1.5" fill="var(--cq-border-strong)" />

            {/* Calendar body */}
            <rect x="3" y="6" width="30" height="27" rx="2" fill="var(--cq-surface)" stroke="var(--cq-border)" strokeWidth="1" />

            {/* Coral header strip */}
            <rect x="3" y="6" width="30" height="8" rx="2" fill="var(--cq-tile-coral)" />
            <rect x="3" y="10" width="30" height="4" fill="var(--cq-tile-coral)" />

            {/* Circle Q — accent stroke */}
            <circle
                cx="18"
                cy="22"
                r="7"
                fill="none"
                stroke="var(--cq-accent)"
                strokeWidth="2"
            />

            {/* Q tail line — animated dash */}
            <line
                x1="23.5"
                y1="27.5"
                x2="27.5"
                y2="31.5"
                stroke="var(--cq-accent)"
                strokeWidth="2.5"
                strokeLinecap="round"
                style={{
                    strokeDasharray: "8",
                    animation: "cq-dash-tail 1.5s ease-in-out infinite alternate",
                }}
            />

            {/* Amber "today" tile inside Q (pulsing) */}
            <rect
                x="14"
                y="19"
                width="5"
                height="5"
                rx="1"
                fill="var(--cq-tile-amber)"
                opacity="0.9"
                style={{ animation: "cq-pulse-dot 2s ease-in-out infinite" }}
            />
        </svg>
    );
}

/**
 * ChroniqWordmark — brand mark + "chroniq" + ".cc" in accent color.
 */
export function ChroniqWordmark({
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
            className={["flex items-center gap-2", className ?? ""].join(" ")}
            style={style}
        >
            <ChroniqBrandMark size={size} />
            <span
                style={{
                    fontSize: `${Math.round(size * 0.53)}px`,
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    fontFamily: "var(--cq-font-display)",
                    lineHeight: 1,
                    userSelect: "none",
                    color: "var(--cq-text)",
                }}
            >
                chroniq
                <span style={{ color: "var(--cq-accent)" }}>.cc</span>
            </span>
        </div>
    );
}
