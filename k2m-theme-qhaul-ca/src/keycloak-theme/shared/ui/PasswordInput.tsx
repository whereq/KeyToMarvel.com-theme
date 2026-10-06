import { useState, forwardRef, type InputHTMLAttributes } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export interface QhPasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    hasError?: boolean;
}

/**
 * QhPasswordInput — password field with show/hide toggle.
 */
export const QhPasswordInput = forwardRef<HTMLInputElement, QhPasswordInputProps>(
    function QhPasswordInput({ hasError = false, className = "", id, ...rest }, ref) {
        const [revealed, setRevealed] = useState(false);

        return (
            <div className="relative w-full">
                <input
                    ref={ref}
                    id={id}
                    type={revealed ? "text" : "password"}
                    className={[
                        "w-full h-[46px] px-3.5 pr-10 text-[15px] font-medium",
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
                        "text-[var(--qh-muted)] hover:text-[var(--qh-accent)]",
                        "transition-colors duration-[var(--qh-transition-fast)]",
                        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--qh-accent)]",
                    ].join(" ")}
                >
                    {revealed ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
            </div>
        );
    },
);
