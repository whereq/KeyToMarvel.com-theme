import type { ReactNode } from "react";

export interface FdDividerProps {
    children?: ReactNode;
    className?: string;
}

export function FdDivider({ children, className = "" }: FdDividerProps) {
    if (!children) {
        return (
            <hr
                className={[
                    "border-none h-px bg-[var(--fd-border-subtle)]",
                    "my-4",
                    className,
                ].join(" ")}
            />
        );
    }

    return (
        <div className={["flex items-center gap-3 my-4", className].join(" ")}>
            <div className="flex-1 h-px bg-[var(--fd-border-subtle)]" />
            <span className="text-xs uppercase tracking-widest text-[var(--fd-text-muted)] font-medium select-none">
                {children}
            </span>
            <div className="flex-1 h-px bg-[var(--fd-border-subtle)]" />
        </div>
    );
}
