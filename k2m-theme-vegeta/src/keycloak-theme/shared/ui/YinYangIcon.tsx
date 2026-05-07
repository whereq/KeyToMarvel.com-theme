import type { CSSProperties } from "react";

interface YinYangIconProps {
  /** Rendered width and height in pixels */
  size: number;
  /** Apply the 25 s slow-spin animation */
  spinning?: boolean;
  /** Extra styles (e.g. drop-shadow filter) applied to the <svg> element */
  style?: CSSProperties;
  className?: string;
}

/**
 * Canonical golden yin-yang icon — single source of truth for the K2M logo shape.
 * Matches public/resources/img/favicon.svg (dark base + gold yin-yang).
 *
 * Usage:
 *   <YinYangIcon size={96} spinning style={{ filter: "drop-shadow(...)" }} />
 */
export const VgYinYangIcon = ({ size, spinning = false, style, className }: YinYangIconProps) => (
  <>
    {spinning && (
      <style>{`
        @keyframes k2m-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    )}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      style={{
        ...(spinning ? { animation: "k2m-spin 25s linear infinite" } : {}),
        ...style,
      }}
      className={className}
      aria-hidden="true"
    >
      {/* Yin (dark) base */}
      <circle cx="50" cy="50" r="50" fill="#0f1120" />
      {/* Yang (gold) right semicircle */}
      <path d="M50,0 A50,50,0,0,1,50,100 L50,0 Z" fill="#f59e0b" />
      {/* Yang head — gold top circle */}
      <circle cx="50" cy="25" r="25" fill="#f59e0b" />
      {/* Yin head — dark bottom circle */}
      <circle cx="50" cy="75" r="25" fill="#0f1120" />
      {/* Yin eye — dark dot inside gold area */}
      <circle cx="50" cy="25" r="10" fill="#0f1120" />
      {/* Yang eye — gold dot inside dark area */}
      <circle cx="50" cy="75" r="10" fill="#f59e0b" />
    </svg>
  </>
);
