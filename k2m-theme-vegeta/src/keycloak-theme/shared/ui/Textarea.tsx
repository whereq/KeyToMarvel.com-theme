import { forwardRef, type TextareaHTMLAttributes } from "react";

export interface VgTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    hasError?: boolean;
}

/**
 * VgTextarea — MetroUI-styled multiline text input.
 */
export const VgTextarea = forwardRef<HTMLTextAreaElement, VgTextareaProps>(function VgTextarea(
    { hasError = false, className = "", ...rest },
    ref,
) {
    return (
        <textarea
            ref={ref}
            className={[
                "w-full px-3 py-2.5 text-sm",
                "bg-[var(--vg-bg-elevated)]",
                "text-[var(--vg-text-primary)]",
                "placeholder:text-[var(--vg-text-muted)]",
                "border border-[var(--vg-border-default)]",
                "rounded-[var(--vg-radius-sm)]",
                "focus:outline-none focus:border-[var(--vg-border-focus)]",
                "focus:ring-1 focus:ring-[var(--vg-border-focus)]",
                hasError
                    ? "border-[var(--vg-error)] focus:border-[var(--vg-error)] focus:ring-[var(--vg-error)]"
                    : "",
                "transition-colors duration-[var(--vg-transition-fast)]",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "resize-y min-h-[80px]",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
            {...rest}
        />
    );
});
