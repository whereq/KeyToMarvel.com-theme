import { forwardRef, type InputHTMLAttributes } from "react";

export interface FdInputProps extends InputHTMLAttributes<HTMLInputElement> {
    hasError?: boolean;
}

/**
 * FdInput — FlowDesk MetroUI text input.
 *
 * Sharp-cornered, flat Metro style with Metro Blue focus ring.
 */
export const FdInput = forwardRef<HTMLInputElement, FdInputProps>(function FdInput(
    { hasError = false, className = "", ...rest },
    ref,
) {
    return (
        <input
            ref={ref}
            className={[
                "w-full px-3 py-2.5 text-sm",
                "bg-[var(--fd-bg-elevated)]",
                "text-[var(--fd-text-primary)]",
                "placeholder:text-[var(--fd-text-muted)]",
                "border border-[var(--fd-border-default)]",
                "rounded-[var(--fd-radius-sm)]",
                "focus:outline-none focus:border-[var(--fd-border-focus)]",
                "focus:ring-1 focus:ring-[var(--fd-border-focus)]",
                hasError
                    ? "border-[var(--fd-error)] focus:border-[var(--fd-error)] focus:ring-[var(--fd-error)]"
                    : "",
                "transition-colors duration-[var(--fd-transition-fast)]",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "[&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_var(--fd-bg-elevated)]",
                "[&:-webkit-autofill]:[-webkit-text-fill-color:var(--fd-text-primary)]",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
            {...rest}
        />
    );
});
