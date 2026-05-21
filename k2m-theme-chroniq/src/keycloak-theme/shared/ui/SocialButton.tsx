import type { AnchorHTMLAttributes, ReactNode } from "react";

export interface CqSocialButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    icon?: ReactNode;
    label: string;
}

/**
 * CqSocialButton — OAuth / social provider button.
 *
 * Metro flat tile, hover lifts with subtle border highlight.
 */
export function CqSocialButton({ icon, label, className = "", ...rest }: CqSocialButtonProps) {
    return (
        <a
            className={[
                "flex items-center justify-center gap-2.5",
                "px-4 py-3 text-sm font-medium",
                "bg-[var(--cq-surface)]",
                "text-[var(--cq-text-2)] hover:text-[var(--cq-text)]",
                "border border-[var(--cq-border)] hover:border-[var(--cq-border-strong)]",
                "rounded-[var(--cq-r-sm)]",
                "transition-colors duration-[var(--cq-transition-fast)]",
                "cursor-pointer select-none",
                "hover:bg-[var(--cq-surface-2)]",
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
