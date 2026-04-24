import type { AnchorHTMLAttributes, ReactNode } from "react";

export interface VgSocialButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    icon?: ReactNode;
    label: string;
}

/**
 * VgSocialButton — OAuth / social provider button.
 *
 * MetroUI flat tile style with hover highlight.
 * Renders as an anchor (not button) to preserve form-outside-link behavior.
 */
export function VgSocialButton({ icon, label, className = "", ...rest }: VgSocialButtonProps) {
    return (
        <a
            className={[
                "flex items-center justify-center gap-2",
                "px-4 py-2.5 text-sm font-medium",
                "bg-[var(--vg-bg-elevated)]",
                "text-[var(--vg-text-secondary)] hover:text-[var(--vg-text-primary)]",
                "border border-[var(--vg-border-default)] hover:border-[var(--vg-border-strong)]",
                "rounded-[var(--vg-radius-sm)]",
                "transition-colors duration-[var(--vg-transition-fast)]",
                "cursor-pointer select-none",
                "hover:bg-[var(--vg-bg-overlay)]",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
            {...rest}
        >
            {icon && <span className="shrink-0 text-base">{icon}</span>}
            <span>{label}</span>
        </a>
    );
}
