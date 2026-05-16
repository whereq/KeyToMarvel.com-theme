import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

export type FdButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type FdButtonSize = "sm" | "md" | "lg";

export interface FdButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: FdButtonVariant;
    size?: FdButtonSize;
    fullWidth?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    children?: ReactNode;
}

const variantStyles: Record<FdButtonVariant, string> = {
    primary:
        "bg-[var(--fd-blue-500)] text-white hover:bg-[var(--fd-blue-600)] " +
        "border border-[var(--fd-blue-500)] hover:border-[var(--fd-blue-600)]",
    secondary:
        "bg-[var(--fd-bg-elevated)] text-[var(--fd-text-primary)] " +
        "border border-[var(--fd-border-default)] hover:border-[var(--fd-border-strong)] hover:bg-[var(--fd-bg-overlay)]",
    ghost:
        "bg-transparent text-[var(--fd-text-secondary)] " +
        "border border-transparent hover:bg-[var(--fd-bg-elevated)] hover:text-[var(--fd-text-primary)]",
    danger:
        "bg-[var(--fd-error)] text-white hover:bg-[#dc2626] " +
        "border border-[var(--fd-error)]",
};

const sizeStyles: Record<FdButtonSize, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
};

/**
 * FdButton — FlowDesk MetroUI button component.
 *
 * Metro Blue primary CTA, sharp corners, flat design.
 */
export const FdButton = forwardRef<HTMLButtonElement, FdButtonProps>(function FdButton(
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
        "transition-colors duration-[var(--fd-transition-fast)] " +
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fd-border-focus)] " +
        "focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--fd-bg-card)] " +
        "disabled:opacity-50 disabled:cursor-not-allowed " +
        "rounded-[var(--fd-radius-sm)] cursor-pointer select-none " +
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
