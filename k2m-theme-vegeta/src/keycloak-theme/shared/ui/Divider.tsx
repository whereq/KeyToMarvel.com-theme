import type { ReactNode } from "react";

export interface VgDividerProps {
    children?: ReactNode;
    className?: string;
}

/**
 * VgDivider — horizontal rule with optional centered text label.
 */
export function VgDivider({ children, className = "" }: VgDividerProps) {
    if (!children) {
        return (
            <hr
                className={[
                    "border-none h-px bg-[var(--vg-border-subtle)]",
                    "my-4",
                    className,
                ].join(" ")}
            />
        );
    }

    return (
        <div className={["flex items-center gap-3 my-4", className].join(" ")}>
            <div className="flex-1 h-px bg-[var(--vg-border-subtle)]" />
            <span className="text-xs uppercase tracking-widest text-[var(--vg-text-muted)] font-medium select-none">
                {children}
            </span>
            <div className="flex-1 h-px bg-[var(--vg-border-subtle)]" />
        </div>
    );
}
