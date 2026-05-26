import { forwardRef, type InputHTMLAttributes } from "react";

export interface CbInputProps extends InputHTMLAttributes<HTMLInputElement> {
    hasError?: boolean;
}

export const CbInput = forwardRef<HTMLInputElement, CbInputProps>(function CbInput(
    { hasError = false, className = "", ...rest },
    ref,
) {
    return (
        <input
            ref={ref}
            className={[
                "w-full px-3 py-2.5 text-sm",
                "bg-[var(--cb-bg-card)]",
                "text-[var(--cb-text-primary)]",
                "placeholder:text-[var(--cb-text-muted)]",
                "border border-[var(--cb-border-default)]",
                "rounded-[var(--cb-radius-sm)]",
                "focus:outline-none focus:border-[var(--cb-border-focus)]",
                "focus:ring-1 focus:ring-[var(--cb-border-focus)]",
                hasError
                    ? "border-[var(--cb-error)] focus:border-[var(--cb-error)] focus:ring-[var(--cb-error)]"
                    : "",
                "transition-colors duration-[var(--cb-transition-fast)]",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "[&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_var(--cb-bg-card)]",
                "[&:-webkit-autofill]:[-webkit-text-fill-color:var(--cb-text-primary)]",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
            {...rest}
        />
    );
});
