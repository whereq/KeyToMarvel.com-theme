import { useState, forwardRef, type InputHTMLAttributes } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export interface VgPasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    hasError?: boolean;
}

/**
 * VgPasswordInput — password input with show/hide toggle.
 *
 * Manages its own reveal state. The toggle icon uses the frontend accent color.
 */
export const VgPasswordInput = forwardRef<HTMLInputElement, VgPasswordInputProps>(
    function VgPasswordInput({ hasError = false, className = "", id, ...rest }, ref) {
        const [revealed, setRevealed] = useState(false);

        return (
            <div className="relative w-full">
                <input
                    ref={ref}
                    id={id}
                    type={revealed ? "text" : "password"}
                    className={[
                        "w-full px-3 py-2.5 pr-10 text-sm",
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
                        "[&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_var(--vg-bg-elevated)]",
                        className,
                    ]
                        .filter(Boolean)
                        .join(" ")}
                    {...rest}
                />
                <button
                    type="button"
                    tabIndex={-1}
                    aria-label={revealed ? "Hide password" : "Show password"}
                    aria-controls={id}
                    onClick={() => setRevealed(v => !v)}
                    className={[
                        "absolute right-2 top-1/2 -translate-y-1/2",
                        "p-1 rounded-[var(--vg-radius-sm)]",
                        "text-[var(--vg-text-muted)] hover:text-[var(--vg-cyan-400)]",
                        "transition-colors duration-[var(--vg-transition-fast)]",
                        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--vg-border-focus)]",
                    ].join(" ")}
                >
                    {revealed ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
            </div>
        );
    },
);
