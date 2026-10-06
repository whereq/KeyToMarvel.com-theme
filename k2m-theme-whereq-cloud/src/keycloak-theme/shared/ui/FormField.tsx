import type { ReactNode } from "react";

export interface WqcFormFieldProps {
    id?: string;
    label?: ReactNode;
    required?: boolean;
    error?: ReactNode;
    hint?: ReactNode;
    children: ReactNode;
    className?: string;
}

/**
 * WqcFormField — label + input + error/hint wrapper.
 *
 * Sentence-case label per brand design (not the uppercase-tracked label
 * style used by the other K2M themes).
 */
export function WqcFormField({
    id,
    label,
    required,
    error,
    hint,
    children,
    className = "",
}: WqcFormFieldProps) {
    return (
        <div className={["flex flex-col gap-1.5", className].join(" ")}>
            {label !== undefined && (
                <label
                    htmlFor={id}
                    className="text-[13px] font-semibold text-[var(--wqc-text)]"
                >
                    {label}
                    {required && (
                        <span className="ml-1 text-[var(--wqc-error)]" aria-hidden="true">
                            *
                        </span>
                    )}
                </label>
            )}
            {children}
            {error && (
                <span
                    className="text-xs text-[var(--wqc-error)] flex items-center gap-1"
                    aria-live="polite"
                >
                    {error}
                </span>
            )}
            {!error && hint && (
                <span className="text-xs text-[var(--wqc-muted)]">{hint}</span>
            )}
        </div>
    );
}
