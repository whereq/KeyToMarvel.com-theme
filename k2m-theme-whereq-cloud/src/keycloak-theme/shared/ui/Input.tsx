import { forwardRef, type InputHTMLAttributes } from "react";

export interface WqcInputProps extends InputHTMLAttributes<HTMLInputElement> {
    hasError?: boolean;
}

/**
 * WqcInput — WhereQCloud MetroUI text input.
 *
 * xs-radius, 2px border per brand design (chunkier than other K2M themes);
 * fill is --wqc-bg (not --wqc-surface) so inputs read as a recessed well
 * against the card.
 */
export const WqcInput = forwardRef<HTMLInputElement, WqcInputProps>(function WqcInput(
    { hasError = false, className = "", ...rest },
    ref,
) {
    return (
        <input
            ref={ref}
            className={[
                "w-full h-[42px] px-3 text-sm",
                "bg-[var(--wqc-bg)]",
                "text-[var(--wqc-text)]",
                "placeholder:text-[var(--wqc-muted-2)]",
                "border-2 border-[var(--wqc-border-strong)]",
                "rounded-[var(--wqc-r-sm)]",
                "focus:outline-none focus:border-[var(--wqc-brand-blue)]",
                hasError ? "border-[var(--wqc-error)] focus:border-[var(--wqc-error)]" : "",
                "transition-colors duration-[var(--wqc-transition-fast)]",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "[&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_var(--wqc-bg)]",
                "[&:-webkit-autofill]:[-webkit-text-fill-color:var(--wqc-text)]",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
            {...rest}
        />
    );
});
