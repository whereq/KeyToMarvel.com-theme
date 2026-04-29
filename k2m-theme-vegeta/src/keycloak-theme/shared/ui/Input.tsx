import { forwardRef, type InputHTMLAttributes } from "react";

export interface VgInputProps extends InputHTMLAttributes<HTMLInputElement> {
    hasError?: boolean;
}

/**
 * VgInput — MetroUI-styled text input.
 *
 * Uses bottom-border-only style by default (clean Metro aesthetic).
 * Error state highlights the border in red.
 */
export const VgInput = forwardRef<HTMLInputElement, VgInputProps>(function VgInput(
    { hasError = false, className = "", ...rest },
    ref,
) {
    return (
        <input
            ref={ref}
            className={[
                // Base
                "w-full px-3 py-2.5 text-sm",
                "bg-[var(--vg-bg-elevated)]",
                "text-[var(--vg-text-primary)]",
                "placeholder:text-[var(--vg-text-muted)]",
                // Border — bottom only for Metro feel, full on elevated state
                "border border-[var(--vg-border-default)]",
                "rounded-[var(--vg-radius-sm)]",
                // Focus
                "focus:outline-none focus:border-[var(--vg-border-focus)]",
                "focus:ring-1 focus:ring-[var(--vg-border-focus)]",
                // Error state
                hasError
                    ? "border-[var(--vg-error)] focus:border-[var(--vg-error)] focus:ring-[var(--vg-error)]"
                    : "",
                // Transition
                "transition-colors duration-[var(--vg-transition-fast)]",
                // Disabled
                "disabled:opacity-50 disabled:cursor-not-allowed",
                // Autofill override
                "[&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_var(--vg-bg-elevated)]",
                "[&:-webkit-autofill]:[-webkit-text-fill-color:var(--vg-text-primary)]",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
            {...rest}
        />
    );
});
