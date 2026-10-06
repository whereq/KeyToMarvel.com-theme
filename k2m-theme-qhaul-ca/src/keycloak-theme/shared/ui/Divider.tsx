import type { ReactNode } from "react";

export interface QhDividerProps {
    children?: ReactNode;
    className?: string;
}

export function QhDivider({ children, className = "" }: QhDividerProps) {
    if (!children) {
        return (
            <hr
                className={[
                    "border-none h-px bg-[var(--qh-border)]",
                    "my-4",
                    className,
                ].join(" ")}
            />
        );
    }

    return (
        <div className={["flex items-center gap-3 my-4", className].join(" ")}>
            <div className="flex-1 h-px bg-[var(--qh-border)]" />
            <span
                className="text-xs uppercase tracking-widest text-[var(--qh-muted)] font-bold select-none"
                style={{ fontFamily: "var(--qh-font-sans)" }}
            >
                {children}
            </span>
            <div className="flex-1 h-px bg-[var(--qh-border)]" />
        </div>
    );
}
