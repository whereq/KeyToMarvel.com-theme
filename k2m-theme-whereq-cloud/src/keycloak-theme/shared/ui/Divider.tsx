import type { ReactNode } from "react";

export interface WqcDividerProps {
    children?: ReactNode;
    className?: string;
}

export function WqcDivider({ children, className = "" }: WqcDividerProps) {
    if (!children) {
        return (
            <hr
                className={[
                    "border-none h-px bg-[var(--wqc-border)]",
                    "my-4",
                    className,
                ].join(" ")}
            />
        );
    }

    return (
        <div className={["flex items-center gap-3 my-4", className].join(" ")}>
            <div className="flex-1 h-px bg-[var(--wqc-border)]" />
            <span
                className="text-xs uppercase tracking-widest text-[var(--wqc-muted)] font-bold select-none"
                style={{ fontFamily: "var(--wqc-font-sans)" }}
            >
                {children}
            </span>
            <div className="flex-1 h-px bg-[var(--wqc-border)]" />
        </div>
    );
}
