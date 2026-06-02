import type { ReactNode } from "react";

export interface FdFormFieldProps {
    id?: string;
    label?: ReactNode;
    required?: boolean;
    error?: ReactNode;
    hint?: ReactNode;
    children: ReactNode;
    className?: string;
}

/**
 * FdFormField — label + input + error/hint wrapper.
 *
 * Metro style: uppercase label, sharp visual hierarchy.
 */
export function FdFormField({
    id,
    label,
    required,
    error,
    hint,
    children,
    className = "",
}: FdFormFieldProps) {
    return (
        <div className={["flex flex-col gap-1.5", className].join(" ")}>
            {label !== undefined && (
                <label
                    htmlFor={id}
                    className="text-xs font-semibold uppercase tracking-wider text-[var(--fd-text-secondary)]"
                >
                    {label}
                    {required && (
                        <span className="ml-1 text-[var(--fd-error)]" aria-hidden="true">
                            *
                        </span>
                    )}
                </label>
            )}
            {children}
            {error && (
                <span
                    className="text-xs text-[var(--fd-error)] flex items-center gap-1"
                    aria-live="polite"
                >
                    {error}
                </span>
            )}
            {!error && hint && (
                <span className="text-xs text-[var(--fd-text-muted)]">{hint}</span>
            )}
        </div>
    );
}
