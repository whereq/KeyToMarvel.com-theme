import type { AnchorHTMLAttributes, ReactNode } from "react";

export interface QhSocialButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    icon?: ReactNode;
    label: string;
}

/**
 * QhSocialButton — OAuth / social provider button.
 *
 * Metro flat tile, hover lifts with subtle border highlight.
 */
export function QhSocialButton({ icon, label, className = "", ...rest }: QhSocialButtonProps) {
    return (
        <a
            className={[
                "flex items-center justify-center gap-2.5",
                "h-12 px-4 text-sm font-semibold",
                "bg-[var(--qh-surface)]",
                "text-[var(--qh-text)]",
                "border border-[var(--qh-border)] hover:border-[var(--qh-border-strong)]",
                "rounded-[var(--qh-r-sm)]",
                "transition-colors duration-[var(--qh-transition-fast)]",
                "cursor-pointer select-none",
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
