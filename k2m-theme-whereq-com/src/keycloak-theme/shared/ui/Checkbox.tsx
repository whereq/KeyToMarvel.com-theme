import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

export interface FdCheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    label?: ReactNode;
    error?: ReactNode;
}

export const FdCheckbox = forwardRef<HTMLInputElement, FdCheckboxProps>(function FdCheckbox(
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
                        "border border-[var(--fd-border-default)]",
                        "bg-[var(--fd-bg-elevated)]",
                        "text-[var(--fd-blue-500)]",
                        "checked:bg-[var(--fd-blue-500)] checked:border-[var(--fd-blue-500)]",
                        "focus:outline-none focus:ring-2 focus:ring-[var(--fd-border-focus)] focus:ring-offset-[var(--fd-bg-card)]",
                        "transition-colors duration-[var(--fd-transition-fast)]",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        "accent-[var(--fd-blue-500)]",
                        className,
                    ]
                        .filter(Boolean)
                        .join(" ")}
                    {...rest}
                />
                {(label ?? children) && (
                    <span className="text-sm text-[var(--fd-text-secondary)] group-hover:text-[var(--fd-text-primary)] transition-colors">
                        {label ?? children}
                    </span>
                )}
            </label>
            {error && (
                <span className="text-xs text-[var(--fd-error)] ml-6" aria-live="polite">
                    {error}
                </span>
            )}
        </div>
    );
});
