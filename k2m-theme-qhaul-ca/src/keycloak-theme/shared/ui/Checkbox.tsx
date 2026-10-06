import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

export interface QhCheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    label?: ReactNode;
    error?: ReactNode;
}

export const QhCheckbox = forwardRef<HTMLInputElement, QhCheckboxProps>(function QhCheckbox(
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
                        "border border-[var(--qh-border)]",
                        "bg-[var(--qh-surface)]",
                        "text-[var(--qh-accent)]",
                        "checked:bg-[var(--qh-accent)] checked:border-[var(--qh-accent)]",
                        "focus:outline-none focus:ring-2 focus:ring-[var(--qh-accent)] focus:ring-offset-[var(--qh-surface)]",
                        "transition-colors duration-[var(--qh-transition-fast)]",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        "accent-[var(--qh-accent)]",
                        "rounded-[var(--qh-r-xs)]",
                        className,
                    ]
                        .filter(Boolean)
                        .join(" ")}
                    {...rest}
                />
                {(label ?? children) && (
                    <span className="text-sm text-[var(--qh-text-2)] group-hover:text-[var(--qh-text)] transition-colors">
                        {label ?? children}
                    </span>
                )}
            </label>
            {error && (
                <span className="text-xs text-[var(--qh-error)] ml-6" aria-live="polite">
                    {error}
                </span>
            )}
        </div>
    );
});
