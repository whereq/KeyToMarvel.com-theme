import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

export type VgButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "frontend" | "backend";
export type VgButtonSize = "sm" | "md" | "lg";

export interface VgButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: VgButtonVariant;
    size?: VgButtonSize;
    fullWidth?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    children?: ReactNode;
}

const variantStyles: Record<VgButtonVariant, string> = {
    primary:
        "bg-[var(--vg-purple-500)] text-white hover:bg-[var(--vg-purple-600)] " +
        "border border-[var(--vg-purple-500)] hover:border-[var(--vg-purple-600)]",
    secondary:
        "bg-[var(--vg-bg-elevated)] text-[var(--vg-text-primary)] " +
        "border border-[var(--vg-border-default)] hover:border-[var(--vg-border-strong)] hover:bg-[var(--vg-bg-overlay)]",
    ghost:
        "bg-transparent text-[var(--vg-text-secondary)] " +
        "border border-transparent hover:bg-[var(--vg-bg-elevated)] hover:text-[var(--vg-text-primary)]",
    danger:
        "bg-[var(--vg-error)] text-white hover:bg-[#e03244] " +
        "border border-[var(--vg-error)]",
    /** Frontend accent — cyan — for user-facing CTAs */
    frontend:
        "bg-[var(--vg-cyan-400)] text-[var(--vg-text-inverse)] " +
        "border border-[var(--vg-cyan-400)] hover:bg-[var(--vg-cyan-500)] hover:border-[var(--vg-cyan-500)] font-semibold",
    /** Backend accent — gold — for admin/system actions */
    backend:
        "bg-[var(--vg-gold-400)] text-[var(--vg-text-inverse)] " +
        "border border-[var(--vg-gold-400)] hover:bg-[var(--vg-gold-500)] hover:border-[var(--vg-gold-500)] font-semibold",
};

const sizeStyles: Record<VgButtonSize, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
};

/**
 * VgButton — MetroUI-styled button component.
 *
 * MetroUI design: flat, sharp-cornered, bold typography, strong color blocks.
 * Uses CSS custom properties from the Vegeta design system.
 */
export const VgButton = forwardRef<HTMLButtonElement, VgButtonProps>(function VgButton(
    {
        variant = "primary",
        size = "md",
        fullWidth = false,
        leftIcon,
        rightIcon,
        className = "",
        children,
        disabled,
        ...rest
    },
    ref,
) {
    const base =
        "inline-flex items-center justify-center gap-2 font-medium " +
        "transition-colors duration-[var(--vg-transition-fast)] " +
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--vg-border-focus)] " +
        "focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--vg-bg-card)] " +
        "disabled:opacity-50 disabled:cursor-not-allowed " +
        "rounded-[var(--vg-radius-sm)] cursor-pointer select-none " +
        "uppercase tracking-wide text-xs font-semibold";

    return (
        <button
            ref={ref}
            disabled={disabled}
            className={[
                base,
                variantStyles[variant],
                sizeStyles[size],
                fullWidth ? "w-full" : "",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
            {...rest}
        >
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </button>
    );
});
