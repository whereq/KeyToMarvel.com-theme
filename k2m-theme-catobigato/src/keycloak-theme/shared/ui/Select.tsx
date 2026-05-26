import { forwardRef, type SelectHTMLAttributes } from "react";

export interface CbSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    hasError?: boolean;
}

export const CbSelect = forwardRef<HTMLSelectElement, CbSelectProps>(function CbSelect(
    { hasError = false, className = "", children, ...rest },
    ref,
) {
    return (
        <select
            ref={ref}
            className={[
                "w-full px-3 py-2.5 text-sm appearance-none",
                "bg-[var(--cb-bg-card)]",
                "text-[var(--cb-text-primary)]",
                "border border-[var(--cb-border-default)]",
                "rounded-[var(--cb-radius-sm)]",
                "focus:outline-none focus:border-[var(--cb-border-focus)]",
                "focus:ring-1 focus:ring-[var(--cb-border-focus)]",
                hasError ? "border-[var(--cb-error)]" : "",
                "transition-colors duration-[var(--cb-transition-fast)]",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
            {...rest}
        >
            {children}
        </select>
    );
});
