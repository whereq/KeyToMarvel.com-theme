import { useState, forwardRef, type InputHTMLAttributes } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export interface FdPasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    hasError?: boolean;
}

/**
 * FdPasswordInput — password field with show/hide toggle.
 *
 * Toggle button uses Metro Blue on hover.
 */
export const FdPasswordInput = forwardRef<HTMLInputElement, FdPasswordInputProps>(
    function FdPasswordInput({ hasError = false, className = "", id, ...rest }, ref) {
        const [revealed, setRevealed] = useState(false);

        return (
            <div className="relative w-full">
                <input
                    ref={ref}
                    id={id}
                    type={revealed ? "text" : "password"}
                    className={[
                        "w-full px-3 py-2.5 pr-10 text-sm",
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
                        "p-1",
                        "text-[var(--fd-text-muted)] hover:text-[var(--fd-blue-500)]",
                        "transition-colors duration-[var(--fd-transition-fast)]",
                        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--fd-border-focus)]",
                    ].join(" ")}
                >
                    {revealed ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
            </div>
        );
    },
);
