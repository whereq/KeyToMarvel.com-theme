import type { ReactNode, HTMLAttributes } from "react";

export interface CbCardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}

export function CbCard({ children, className = "", style, ...rest }: CbCardProps) {
    return (
        <div
            className={["rounded-[var(--cb-radius-md)]", className].join(" ")}
            style={{
                background: "var(--cb-bg-card)",
                border: "1px solid var(--cb-border-subtle)",
                boxShadow: "var(--cb-shadow-card)",
                ...style,
            }}
            {...rest}
        >
            {children}
        </div>
    );
}
