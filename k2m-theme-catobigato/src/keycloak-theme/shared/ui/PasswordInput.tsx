import { useState, forwardRef, type InputHTMLAttributes } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export interface CbPasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    hasError?: boolean;
}

export const CbPasswordInput = forwardRef<HTMLInputElement, CbPasswordInputProps>(
    function CbPasswordInput({ hasError = false, className = "", id, ...rest }, ref) {
        const [revealed, setRevealed] = useState(false);

        return (
            <div className="relative w-full">
                <input
                    ref={ref}
                    id={id}
                    type={revealed ? "text" : "password"}
                    className={[
                        "w-full px-3 py-2.5 pr-10 text-sm",
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
                        "p-1 rounded-[var(--cb-radius-sm)]",
                        "text-[var(--cb-text-muted)] hover:text-[var(--cb-orange-400)]",
                        "transition-colors duration-[var(--cb-transition-fast)]",
                        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--cb-border-focus)]",
                    ].join(" ")}
                >
                    {revealed ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
            </div>
        );
    },
);
