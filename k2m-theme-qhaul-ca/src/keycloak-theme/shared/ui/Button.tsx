import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

export type QhButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type QhButtonSize = "sm" | "md" | "lg";

export interface QhButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: QhButtonVariant;
    size?: QhButtonSize;
    fullWidth?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    children?: ReactNode;
}

const variantStyles: Record<QhButtonVariant, string> = {
    primary:
        "bg-[var(--qh-accent)] text-[var(--qh-accent-ink)] hover:bg-[var(--qh-accent-hover)] " +
        "border border-[var(--qh-accent)] hover:border-[var(--qh-accent-hover)]",
    secondary:
        "bg-[var(--qh-surface-2)] text-[var(--qh-text)] " +
        "border border-[var(--qh-border)] hover:border-[var(--qh-border-strong)] hover:bg-[var(--qh-surface)]",
    ghost:
        "bg-transparent text-[var(--qh-text-2)] " +
        "border border-transparent hover:bg-[var(--qh-surface-2)] hover:text-[var(--qh-text)]",
    danger:
        "bg-[var(--qh-error)] text-white hover:opacity-90 " +
        "border border-[var(--qh-error)]",
};

const sizeStyles: Record<QhButtonSize, string> = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3.5 text-[15px]",
};

/**
 * QhButton — QHaul MetroUI button component.
 *
 * Orange primary CTA, xs-radius corners, flat design, sentence case per brand design.
 */
export const QhButton = forwardRef<HTMLButtonElement, QhButtonProps>(function QhButton(
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
        "inline-flex items-center justify-center gap-2 font-bold tracking-[0.01em] " +
        "transition-all duration-[var(--qh-transition-fast)] " +
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--qh-accent)] " +
        "focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--qh-surface)] " +
        "disabled:opacity-50 disabled:cursor-not-allowed " +
        "rounded-[var(--qh-r-sm)] cursor-pointer select-none";

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
