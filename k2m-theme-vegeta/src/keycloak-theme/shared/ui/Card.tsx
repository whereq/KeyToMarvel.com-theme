import type { ReactNode, HTMLAttributes } from "react";

export interface VgCardProps extends HTMLAttributes<HTMLDivElement> {
    /** Accent bar color on the top edge: "purple" | "cyan" | "gold" | "none" */
    accent?: "purple" | "cyan" | "gold" | "none";
    padded?: boolean;
    children: ReactNode;
}

const accentStyles: Record<NonNullable<VgCardProps["accent"]>, string> = {
    purple: "border-t-2 border-t-[var(--vg-purple-500)]",
    cyan:   "border-t-2 border-t-[var(--vg-cyan-400)]",
    gold:   "border-t-2 border-t-[var(--vg-gold-400)]",
    none:   "",
};

/**
 * VgCard — MetroUI flat panel.
 *
 * Flat dark surface with optional colored top-edge accent (Metro tile style).
 * No heavy shadows — consistent with MetroUI's clean aesthetic.
 */
export function VgCard({
    accent = "none",
    padded = true,
    children,
    className = "",
    ...rest
}: VgCardProps) {
    return (
        <div
            className={[
                "bg-[var(--vg-bg-card)]",
                "border border-[var(--vg-border-subtle)]",
                "rounded-[var(--vg-radius-md)]",
                accentStyles[accent],
                padded ? "p-6" : "",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
            {...rest}
        >
            {children}
        </div>
    );
}
