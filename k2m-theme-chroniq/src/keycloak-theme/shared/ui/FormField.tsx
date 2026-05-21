import type { ReactNode } from "react";

export interface CqFormFieldProps {
    id?: string;
    label?: ReactNode;
    required?: boolean;
    error?: ReactNode;
    hint?: ReactNode;
    children: ReactNode;
    className?: string;
}

/**
 * CqFormField — label + input + error/hint wrapper.
 *
 * Metro style: uppercase label, sharp visual hierarchy.
 */
export function CqFormField({
    id,
    label,
    required,
    error,
    hint,
    children,
    className = "",
}: CqFormFieldProps) {
    return (
        <div className={["flex flex-col gap-1.5", className].join(" ")}>
            {label !== undefined && (
                <label
                    htmlFor={id}
                    className="text-xs font-semibold uppercase tracking-wider text-[var(--cq-text-2)]"
                >
                    {label}
                    {required && (
                        <span className="ml-1 text-[var(--cq-error)]" aria-hidden="true">
                            *
                        </span>
                    )}
                </label>
            )}
            {children}
            {error && (
                <span
                    className="text-xs text-[var(--cq-error)] flex items-center gap-1"
                    aria-live="polite"
                >
                    {error}
                </span>
            )}
            {!error && hint && (
                <span className="text-xs text-[var(--cq-muted)]">{hint}</span>
            )}
        </div>
    );
}
