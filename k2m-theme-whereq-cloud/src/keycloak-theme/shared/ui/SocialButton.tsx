import type { AnchorHTMLAttributes, ReactNode } from "react";

export interface WqcSocialButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    icon?: ReactNode;
    label: string;
}

/**
 * WqcSocialButton — OAuth / social provider button.
 *
 * Metro flat tile, hover lifts with subtle border highlight.
 */
export function WqcSocialButton({ icon, label, className = "", ...rest }: WqcSocialButtonProps) {
    return (
        <a
            className={[
                "flex items-center justify-center gap-2",
                "h-11 px-3 text-[13px] font-semibold",
                "bg-[var(--wqc-surface)]",
                "text-[var(--wqc-text)]",
                "border border-[var(--wqc-border)] hover:border-[var(--wqc-accent)] hover:bg-[var(--wqc-surface-2)]",
                "rounded-[var(--wqc-r-sm)]",
                "transition-colors duration-[var(--wqc-transition-fast)]",
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
