import type { AnchorHTMLAttributes, ReactNode } from "react";

export interface CbSocialButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    icon?: ReactNode;
    label: string;
}

export function CbSocialButton({ icon, label, className = "", ...rest }: CbSocialButtonProps) {
    return (
        <a
            className={[
                "flex items-center justify-center gap-2",
                "px-4 py-2.5 text-sm font-medium",
                "bg-[var(--cb-bg-card)]",
                "text-[var(--cb-text-secondary)] hover:text-[var(--cb-text-primary)]",
                "border border-[var(--cb-border-default)] hover:border-[var(--cb-border-strong)]",
                "rounded-[var(--cb-radius-sm)]",
                "transition-colors duration-[var(--cb-transition-fast)]",
                "cursor-pointer select-none",
                "hover:bg-[var(--cb-bg-elevated)]",
                "shadow-[var(--cb-shadow-sm)]",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
            {...rest}
        >
            {icon && <span className="shrink-0 text-xl leading-none">{icon}</span>}
            <span>{label}</span>
        </a>
    );
}
