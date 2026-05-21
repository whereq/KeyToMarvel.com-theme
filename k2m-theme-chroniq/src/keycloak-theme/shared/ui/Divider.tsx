import type { ReactNode } from "react";

export interface CqDividerProps {
    children?: ReactNode;
    className?: string;
}

export function CqDivider({ children, className = "" }: CqDividerProps) {
    if (!children) {
        return (
            <hr
                className={[
                    "border-none h-px bg-[var(--cq-border)]",
                    "my-4",
                    className,
                ].join(" ")}
            />
        );
    }

    return (
        <div className={["flex items-center gap-3 my-4", className].join(" ")}>
            <div className="flex-1 h-px bg-[var(--cq-border)]" />
            <span
                className="text-xs uppercase tracking-widest text-[var(--cq-muted)] font-medium select-none"
                style={{ fontFamily: "var(--cq-font-mono)" }}
            >
                {children}
            </span>
            <div className="flex-1 h-px bg-[var(--cq-border)]" />
        </div>
    );
}
