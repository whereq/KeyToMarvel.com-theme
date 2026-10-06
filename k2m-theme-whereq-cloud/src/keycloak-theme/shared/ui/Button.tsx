import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

export type WqcButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type WqcButtonSize = "sm" | "md" | "lg";

export interface WqcButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: WqcButtonVariant;
    size?: WqcButtonSize;
    fullWidth?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    children?: ReactNode;
}

const variantStyles: Record<WqcButtonVariant, string> = {
    // Constant brand blue in both dark/light mode, per design (not the adaptive --wqc-accent).
    primary:
        "bg-[var(--wqc-brand-blue)] text-white hover:bg-[var(--wqc-brand-blue-hover)] " +
        "border border-[var(--wqc-brand-blue)] hover:border-[var(--wqc-brand-blue-hover)] " +
        "active:scale-[0.98]",
    secondary:
        "bg-[var(--wqc-surface-2)] text-[var(--wqc-text)] " +
        "border border-[var(--wqc-border)] hover:border-[var(--wqc-border-strong)] hover:bg-[var(--wqc-surface)]",
    ghost:
        "bg-transparent text-[var(--wqc-text-2)] " +
        "border border-transparent hover:bg-[var(--wqc-surface-2)] hover:text-[var(--wqc-text)]",
    danger:
        "bg-[var(--wqc-error)] text-white hover:opacity-90 " +
        "border border-[var(--wqc-error)]",
};

const sizeStyles: Record<WqcButtonSize, string> = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3.5 text-[15px]",
};

/**
 * WqcButton — WhereQCloud MetroUI button component.
 *
 * Orange primary CTA, xs-radius corners, flat design, sentence case per brand design.
 */
export const WqcButton = forwardRef<HTMLButtonElement, WqcButtonProps>(function WqcButton(
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
        "transition-all duration-[var(--wqc-transition-fast)] " +
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--wqc-brand-blue)] " +
        "focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--wqc-surface)] " +
        "disabled:opacity-50 disabled:cursor-not-allowed " +
        "rounded-[var(--wqc-r-sm)] cursor-pointer select-none";

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
