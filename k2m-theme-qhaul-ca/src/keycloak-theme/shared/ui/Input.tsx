import { forwardRef, type InputHTMLAttributes } from "react";

export interface QhInputProps extends InputHTMLAttributes<HTMLInputElement> {
    hasError?: boolean;
}

/**
 * QhInput — QHaul MetroUI text input.
 *
 * xs-radius, flat Metro style with accent focus ring.
 */
export const QhInput = forwardRef<HTMLInputElement, QhInputProps>(function QhInput(
    { hasError = false, className = "", ...rest },
    ref,
) {
    return (
        <input
            ref={ref}
            className={[
                "w-full h-[46px] px-3.5 text-[15px] font-medium",
                "bg-[var(--qh-surface)]",
                "text-[var(--qh-text)]",
                "placeholder:text-[var(--qh-muted-2)]",
                "border border-[var(--qh-border)]",
                "rounded-[var(--qh-r-sm)]",
                "focus:outline-2 focus:outline-[var(--qh-accent)] focus:-outline-offset-2",
                hasError ? "border-[var(--qh-error)] focus:outline-[var(--qh-error)]" : "",
                "transition-colors duration-[var(--qh-transition-fast)]",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "[&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_var(--qh-surface)]",
                "[&:-webkit-autofill]:[-webkit-text-fill-color:var(--qh-text)]",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
            {...rest}
        />
    );
});
