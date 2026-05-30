interface LogoProps {
    size?: number;
    className?: string;
}

/**
 * K-Chart F logo — F letterform built from ascending K-line candlesticks.
 * Spine + first two candles use currentColor; last two candles use --accent (amber).
 */
export function FlowDeskLogo({ size = 40, className = "" }: LogoProps) {
    return (
        <svg
            viewBox="0 0 56 56"
            fill="none"
            width={size}
            height={size}
            aria-label="FlowDesk"
            className={className}
            style={{ color: "var(--text)", flexShrink: 0 }}
        >
            {/* Spine */}
            <rect x="7" y="4" width="5" height="48" rx="1.5" fill="currentColor" />
            {/* Candle 1 — text color */}
            <line x1="18" y1="11" x2="18" y2="22" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            <rect x="15.5" y="14" width="5" height="6" rx="0.5" fill="currentColor" />
            {/* Candle 2 — text color, hollow (ascending) */}
            <line x1="27" y1="7" x2="27" y2="21" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            <rect x="24.5" y="9" width="5" height="10" rx="0.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
            {/* Candle 3 — accent amber, breakout */}
            <line x1="36" y1="3" x2="36" y2="18" stroke="var(--accent)" strokeWidth="1.4" strokeLinecap="round" />
            <rect x="33.5" y="5" width="5" height="10" rx="0.5" fill="var(--accent)" />
            {/* Candle 4 — accent amber, highest */}
            <line x1="45" y1="2" x2="45" y2="13" stroke="var(--accent)" strokeWidth="1.4" strokeLinecap="round" />
            <rect x="42.5" y="3" width="5" height="7" rx="0.5" fill="var(--accent)" />
            {/* Crossbar */}
            <rect x="7" y="29" width="22" height="9" rx="1" fill="currentColor" />
            {/* Base accent dot */}
            <circle cx="9.5" cy="48" r="2.5" fill="var(--accent)" />
        </svg>
    );
}

/** Horizontal wordmark: K-Chart F logo + "FlowDesk" text */
export function FlowDeskWordmark({ size = 32, className = "" }: LogoProps) {
    return (
        <div className={`flex items-center gap-3 ${className}`} style={{ lineHeight: 1 }}>
            <FlowDeskLogo size={size} />
            <span
                style={{
                    fontFamily: "var(--ui)",
                    fontSize: `${size * 0.56}px`,
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                    color: "var(--text)",
                }}
            >
                Flow<span style={{ opacity: 0.55 }}>Desk</span>
            </span>
        </div>
    );
}
