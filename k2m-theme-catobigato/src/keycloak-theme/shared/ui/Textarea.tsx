import { forwardRef, type TextareaHTMLAttributes } from "react";

export interface CbTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    hasError?: boolean;
}

export const CbTextarea = forwardRef<HTMLTextAreaElement, CbTextareaProps>(function CbTextarea(
    { hasError = false, className = "", ...rest },
    ref,
) {
    return (
        <textarea
            ref={ref}
            className={[
                "w-full px-3 py-2.5 text-sm min-h-[80px]",
                "bg-[var(--cb-bg-card)]",
                "text-[var(--cb-text-primary)]",
                "placeholder:text-[var(--cb-text-muted)]",
                "border border-[var(--cb-border-default)]",
                "rounded-[var(--cb-radius-sm)]",
                "focus:outline-none focus:border-[var(--cb-border-focus)]",
                "focus:ring-1 focus:ring-[var(--cb-border-focus)]",
                hasError ? "border-[var(--cb-error)]" : "",
                "transition-colors duration-[var(--cb-transition-fast)]",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "resize-y",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
            {...rest}
        />
    );
});
