import { forwardRef, type InputHTMLAttributes } from "react";

export interface CqInputProps extends InputHTMLAttributes<HTMLInputElement> {
    hasError?: boolean;
}

/**
 * CqInput — Chroniq MetroUI text input.
 *
 * xs-radius, flat Metro style with accent focus ring.
 */
export const CqInput = forwardRef<HTMLInputElement, CqInputProps>(function CqInput(
    { hasError = false, className = "", ...rest },
    ref,
) {
    return (
        <input
            ref={ref}
            className={[
                "w-full px-3 py-2.5 text-sm",
                "bg-[var(--cq-surface-2)]",
                "text-[var(--cq-text)]",
                "placeholder:text-[var(--cq-muted)]",
                "border border-[var(--cq-border)]",
                "rounded-[var(--cq-r-sm)]",
                "focus:outline-none focus:border-[var(--cq-accent)]",
                "focus:ring-1 focus:ring-[var(--cq-accent)]",
                hasError
                    ? "border-[var(--cq-error)] focus:border-[var(--cq-error)] focus:ring-[var(--cq-error)]"
                    : "",
                "transition-colors duration-[var(--cq-transition-fast)]",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "[&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_var(--cq-surface-2)]",
                "[&:-webkit-autofill]:[-webkit-text-fill-color:var(--cq-text)]",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
            {...rest}
        />
    );
});
