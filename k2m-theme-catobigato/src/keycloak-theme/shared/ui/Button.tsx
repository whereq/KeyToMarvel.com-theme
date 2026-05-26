import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

export type CbButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type CbButtonSize = "sm" | "md" | "lg";

export interface CbButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: CbButtonVariant;
    size?: CbButtonSize;
    fullWidth?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    children?: ReactNode;
}

const variantStyles: Record<CbButtonVariant, string> = {
    primary:
        "bg-[var(--cb-orange-400)] text-white hover:bg-[var(--cb-orange-500)] " +
        "border border-[var(--cb-orange-400)] hover:border-[var(--cb-orange-500)]",
    secondary:
        "bg-[var(--cb-bg-card)] text-[var(--cb-text-primary)] " +
        "border border-[var(--cb-border-default)] hover:border-[var(--cb-border-strong)] hover:bg-[var(--cb-bg-elevated)]",
    ghost:
        "bg-transparent text-[var(--cb-text-secondary)] " +
        "border border-transparent hover:bg-[var(--cb-bg-elevated)] hover:text-[var(--cb-text-primary)]",
    danger:
        "bg-[var(--cb-error)] text-white hover:bg-[#dc2626] " +
        "border border-[var(--cb-error)]",
};

const sizeStyles: Record<CbButtonSize, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
};

export const CbButton = forwardRef<HTMLButtonElement, CbButtonProps>(function CbButton(
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
        "transition-colors duration-[var(--cb-transition-fast)] " +
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cb-border-focus)] " +
        "focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--cb-bg-card)] " +
        "disabled:opacity-50 disabled:cursor-not-allowed " +
        "rounded-[var(--cb-radius-sm)] cursor-pointer select-none";

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
