import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

export interface WqcCheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    label?: ReactNode;
    error?: ReactNode;
}

export const WqcCheckbox = forwardRef<HTMLInputElement, WqcCheckboxProps>(function WqcCheckbox(
    { label, error, className = "", id, children, ...rest },
    ref,
) {
    return (
        <div className="flex flex-col gap-1">
            <label
                htmlFor={id}
                className="flex items-center gap-2 cursor-pointer select-none text-[13px] text-[var(--wqc-text)]"
            >
                <input
                    ref={ref}
                    id={id}
                    type="checkbox"
                    className={[
                        "h-4 w-4 m-0 shrink-0 cursor-pointer",
                        "accent-[var(--wqc-brand-blue)]",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        className,
                    ]
                        .filter(Boolean)
                        .join(" ")}
                    {...rest}
                />
                {label ?? children}
            </label>
            {error && (
                <span className="text-xs text-[var(--wqc-error)] ml-6" aria-live="polite">
                    {error}
                </span>
            )}
        </div>
    );
});
