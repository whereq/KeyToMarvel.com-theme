import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

export interface VgCheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    label?: ReactNode;
    error?: ReactNode;
}

/**
 * VgCheckbox — styled checkbox with optional label.
 *
 * Uses accent-purple for the checked state background.
 */
export const VgCheckbox = forwardRef<HTMLInputElement, VgCheckboxProps>(function VgCheckbox(
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
                        "rounded-[var(--vg-radius-sm)]",
                        "border border-[var(--vg-border-default)]",
                        "bg-[var(--vg-bg-elevated)]",
                        "text-[var(--vg-purple-500)]",
                        "checked:bg-[var(--vg-purple-500)] checked:border-[var(--vg-purple-500)]",
                        "focus:outline-none focus:ring-2 focus:ring-[var(--vg-border-focus)] focus:ring-offset-[var(--vg-bg-card)]",
                        "transition-colors duration-[var(--vg-transition-fast)]",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        "accent-[var(--vg-purple-500)]",
                        className,
                    ]
                        .filter(Boolean)
                        .join(" ")}
                    {...rest}
                />
                {(label ?? children) && (
                    <span className="text-sm text-[var(--vg-text-secondary)] group-hover:text-[var(--vg-text-primary)] transition-colors">
                        {label ?? children}
                    </span>
                )}
            </label>
            {error && (
                <span className="text-xs text-[var(--vg-error)] ml-6" aria-live="polite">
                    {error}
                </span>
            )}
        </div>
    );
});
