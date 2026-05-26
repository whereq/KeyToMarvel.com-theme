import type { ReactNode } from "react";

export interface CbDividerProps {
    children?: ReactNode;
    className?: string;
}

export function CbDivider({ children, className = "" }: CbDividerProps) {
    if (!children) {
        return (
            <hr
                className={[
                    "border-none h-px bg-[var(--cb-border-subtle)]",
                    "my-4",
                    className,
                ].join(" ")}
            />
        );
    }

    return (
        <div className={["flex items-center gap-3 my-4", className].join(" ")}>
            <div className="flex-1 h-px bg-[var(--cb-border-subtle)]" />
            <span className="text-xs tracking-widest text-[var(--cb-text-muted)] font-medium select-none">
                {children}
            </span>
            <div className="flex-1 h-px bg-[var(--cb-border-subtle)]" />
        </div>
    );
}
