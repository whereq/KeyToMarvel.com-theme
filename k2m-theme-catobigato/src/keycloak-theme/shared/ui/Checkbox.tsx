import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

export interface CbCheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    label?: ReactNode;
    error?: ReactNode;
}

export const CbCheckbox = forwardRef<HTMLInputElement, CbCheckboxProps>(function CbCheckbox(
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
                        "rounded-[var(--cb-radius-sm)]",
                        "border border-[var(--cb-border-default)]",
                        "bg-[var(--cb-bg-card)]",
                        "text-[var(--cb-orange-400)]",
                        "checked:bg-[var(--cb-orange-400)] checked:border-[var(--cb-orange-400)]",
                        "focus:outline-none focus:ring-2 focus:ring-[var(--cb-border-focus)] focus:ring-offset-[var(--cb-bg-card)]",
                        "transition-colors duration-[var(--cb-transition-fast)]",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        "accent-[var(--cb-orange-400)]",
                        className,
                    ]
                        .filter(Boolean)
                        .join(" ")}
                    {...rest}
                />
                {(label ?? children) && (
                    <span className="text-sm text-[var(--cb-text-secondary)] group-hover:text-[var(--cb-text-primary)] transition-colors">
                        {label ?? children}
                    </span>
                )}
            </label>
            {error && (
                <span className="text-xs text-[var(--cb-error)] ml-6" aria-live="polite">
                    {error}
                </span>
            )}
        </div>
    );
});
