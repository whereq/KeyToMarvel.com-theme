import { forwardRef, type SelectHTMLAttributes } from "react";

export interface VgSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    hasError?: boolean;
}

/**
 * VgSelect — MetroUI-styled select dropdown.
 */
export const VgSelect = forwardRef<HTMLSelectElement, VgSelectProps>(function VgSelect(
    { hasError = false, className = "", ...rest },
    ref,
) {
    return (
        <select
            ref={ref}
            className={[
                "w-full px-3 py-2.5 text-sm appearance-none",
                "bg-[var(--vg-bg-elevated)]",
                "text-[var(--vg-text-primary)]",
                "border border-[var(--vg-border-default)]",
                "rounded-[var(--vg-radius-sm)]",
                "focus:outline-none focus:border-[var(--vg-border-focus)]",
                "focus:ring-1 focus:ring-[var(--vg-border-focus)]",
                hasError
                    ? "border-[var(--vg-error)] focus:border-[var(--vg-error)] focus:ring-[var(--vg-error)]"
                    : "",
                "transition-colors duration-[var(--vg-transition-fast)]",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "cursor-pointer",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
            {...rest}
        />
    );
});
