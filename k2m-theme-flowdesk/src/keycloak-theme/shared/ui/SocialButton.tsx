import type { AnchorHTMLAttributes, ReactNode } from "react";

export interface FdSocialButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    icon?: ReactNode;
    label: string;
}

/**
 * FdSocialButton — OAuth / social provider button.
 *
 * Metro flat tile, hover lifts with subtle border highlight.
 */
export function FdSocialButton({ icon, label, className = "", ...rest }: FdSocialButtonProps) {
    return (
        <a
            className={[
                "flex items-center justify-center gap-2.5",
                "px-4 py-3 text-sm font-medium",
                "bg-[var(--fd-bg-elevated)]",
                "text-[var(--fd-text-secondary)] hover:text-[var(--fd-text-primary)]",
                "border border-[var(--fd-border-default)] hover:border-[var(--fd-border-chrome)]",
                "rounded-[var(--fd-radius-sm)]",
                "transition-colors duration-[var(--fd-transition-fast)]",
                "cursor-pointer select-none",
                "hover:bg-[var(--fd-bg-overlay)]",
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
