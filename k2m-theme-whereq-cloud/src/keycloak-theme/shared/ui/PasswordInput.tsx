import { useState, forwardRef, type InputHTMLAttributes } from "react";

export interface WqcPasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    hasError?: boolean;
    /** Localized labels for the reveal toggle button (defaults to English). */
    showLabel?: string;
    hideLabel?: string;
}

/**
 * WqcPasswordInput — password field with a "Show"/"Hide" text toggle sharing
 * the input's border, per brand design (not an overlapping eye icon).
 */
export const WqcPasswordInput = forwardRef<HTMLInputElement, WqcPasswordInputProps>(
    function WqcPasswordInput(
        { hasError = false, className = "", id, showLabel = "Show", hideLabel = "Hide", ...rest },
        ref,
    ) {
        const [revealed, setRevealed] = useState(false);

        return (
            <div
                className={[
                    "flex h-[42px] overflow-hidden",
                    "border-2 border-[var(--wqc-border-strong)]",
                    "rounded-[var(--wqc-r-sm)]",
                    "bg-[var(--wqc-bg)]",
                    "focus-within:border-[var(--wqc-brand-blue)]",
                    hasError ? "border-[var(--wqc-error)] focus-within:border-[var(--wqc-error)]" : "",
                    "transition-colors duration-[var(--wqc-transition-fast)]",
                    className,
                ]
                    .filter(Boolean)
                    .join(" ")}
            >
                <input
                    ref={ref}
                    id={id}
                    type={revealed ? "text" : "password"}
                    className={[
                        "flex-1 min-w-0 h-full px-3 text-sm",
                        "bg-transparent text-[var(--wqc-text)]",
                        "placeholder:text-[var(--wqc-muted-2)]",
                        "border-none outline-none",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        "[&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_var(--wqc-bg)]",
                        "[&:-webkit-autofill]:[-webkit-text-fill-color:var(--wqc-text)]",
                    ].join(" ")}
                    {...rest}
                />
                <button
                    type="button"
                    tabIndex={-1}
                    aria-label={revealed ? hideLabel : showLabel}
                    aria-controls={id}
                    onClick={() => setRevealed(v => !v)}
                    className={[
                        "px-3 text-xs font-bold shrink-0",
                        "bg-[var(--wqc-surface-2)] text-[var(--wqc-text)]",
                        "hover:bg-[var(--wqc-border)]",
                        "transition-colors duration-[var(--wqc-transition-fast)]",
                        "cursor-pointer",
                    ].join(" ")}
                >
                    {revealed ? hideLabel : showLabel}
                </button>
            </div>
        );
    },
);
