import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

export type CqButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type CqButtonSize = "sm" | "md" | "lg";

export interface CqButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: CqButtonVariant;
    size?: CqButtonSize;
    fullWidth?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    children?: ReactNode;
}

const variantStyles: Record<CqButtonVariant, string> = {
    primary:
        "bg-[var(--cq-accent)] text-[var(--cq-accent-ink)] hover:opacity-90 " +
        "border border-[var(--cq-accent)]",
    secondary:
        "bg-[var(--cq-surface-2)] text-[var(--cq-text)] " +
        "border border-[var(--cq-border)] hover:border-[var(--cq-border-strong)] hover:bg-[var(--cq-surface)]",
    ghost:
        "bg-transparent text-[var(--cq-text-2)] " +
        "border border-transparent hover:bg-[var(--cq-surface-2)] hover:text-[var(--cq-text)]",
    danger:
        "bg-[var(--cq-error)] text-white hover:opacity-90 " +
        "border border-[var(--cq-error)]",
};

const sizeStyles: Record<CqButtonSize, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
};

/**
 * CqButton — Chroniq MetroUI button component.
 *
 * Accent-blue primary CTA, xs-radius corners, flat design.
 */
export const CqButton = forwardRef<HTMLButtonElement, CqButtonProps>(function CqButton(
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
        "inline-flex items-center justify-center gap-2 font-semibold " +
        "transition-all duration-[var(--cq-transition-fast)] " +
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cq-accent)] " +
        "focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--cq-surface)] " +
        "disabled:opacity-50 disabled:cursor-not-allowed " +
        "rounded-[var(--cq-r-sm)] cursor-pointer select-none " +
        "uppercase tracking-wide text-xs";

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
