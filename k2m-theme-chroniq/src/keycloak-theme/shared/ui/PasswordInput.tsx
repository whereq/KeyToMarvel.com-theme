import { useState, forwardRef, type InputHTMLAttributes } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export interface CqPasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    hasError?: boolean;
}

/**
 * CqPasswordInput — password field with show/hide toggle.
 */
export const CqPasswordInput = forwardRef<HTMLInputElement, CqPasswordInputProps>(
    function CqPasswordInput({ hasError = false, className = "", id, ...rest }, ref) {
        const [revealed, setRevealed] = useState(false);

        return (
            <div className="relative w-full">
                <input
                    ref={ref}
                    id={id}
                    type={revealed ? "text" : "password"}
                    className={[
                        "w-full px-3 py-2.5 pr-10 text-sm",
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
                        "text-[var(--cq-muted)] hover:text-[var(--cq-accent)]",
                        "transition-colors duration-[var(--cq-transition-fast)]",
                        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--cq-accent)]",
                    ].join(" ")}
                >
                    {revealed ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
            </div>
        );
    },
);
