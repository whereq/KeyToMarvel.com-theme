import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

export interface CqCheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    label?: ReactNode;
    error?: ReactNode;
}

export const CqCheckbox = forwardRef<HTMLInputElement, CqCheckboxProps>(function CqCheckbox(
    { label, error, className = "", id, children, ...rest },
    ref,
) {
    return (
        <div className="flex flex-col gap-1">
            <label
                htmlFor={id}
                className="flex items-start gap-2.5 cursor-pointer select-none group"
            >
                <input
                    ref={ref}
                    id={id}
                    type="checkbox"
                    className={[
                        "mt-0.5 h-4 w-4 shrink-0",
                        "border border-[var(--cq-border)]",
                        "bg-[var(--cq-surface-2)]",
                        "text-[var(--cq-accent)]",
                        "checked:bg-[var(--cq-accent)] checked:border-[var(--cq-accent)]",
                        "focus:outline-none focus:ring-2 focus:ring-[var(--cq-accent)] focus:ring-offset-[var(--cq-surface)]",
                        "transition-colors duration-[var(--cq-transition-fast)]",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        "accent-[var(--cq-accent)]",
                        "rounded-[var(--cq-r-xs)]",
                        className,
                    ]
                        .filter(Boolean)
                        .join(" ")}
                    {...rest}
                />
                {(label ?? children) && (
                    <span className="text-sm text-[var(--cq-text-2)] group-hover:text-[var(--cq-text)] transition-colors">
                        {label ?? children}
                    </span>
                )}
            </label>
            {error && (
                <span className="text-xs text-[var(--cq-error)] ml-6" aria-live="polite">
                    {error}
                </span>
            )}
        </div>
    );
});
