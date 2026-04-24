import type { ReactNode } from "react";

export interface VgFormFieldProps {
    id?: string;
    label?: ReactNode;
    required?: boolean;
    error?: ReactNode;
    hint?: ReactNode;
    children: ReactNode;
    className?: string;
}

/**
 * VgFormField — label + input + error/hint wrapper.
 *
 * Provides consistent spacing and visual hierarchy for form fields
 * following MetroUI conventions: bold uppercase labels, clear error states.
 */
export function VgFormField({
    id,
    label,
    required,
    error,
    hint,
    children,
    className = "",
}: VgFormFieldProps) {
    return (
        <div className={["flex flex-col gap-1.5", className].join(" ")}>
            {label !== undefined && (
                <label
                    htmlFor={id}
                    className="text-xs font-semibold uppercase tracking-wider text-[var(--vg-text-secondary)]"
                >
                    {label}
                    {required && (
                        <span className="ml-1 text-[var(--vg-error)]" aria-hidden="true">
                            *
                        </span>
                    )}
                </label>
            )}
            {children}
            {error && (
                <span
                    className="text-xs text-[var(--vg-error)] flex items-center gap-1"
                    aria-live="polite"
                >
                    {error}
                </span>
            )}
            {!error && hint && (
                <span className="text-xs text-[var(--vg-text-muted)]">{hint}</span>
            )}
        </div>
    );
}
