import type { ReactNode } from "react";

export interface QhFormFieldProps {
    id?: string;
    label?: ReactNode;
    required?: boolean;
    error?: ReactNode;
    hint?: ReactNode;
    children: ReactNode;
    className?: string;
}

/**
 * QhFormField — label + input + error/hint wrapper.
 *
 * Metro style: uppercase label, sharp visual hierarchy.
 */
export function QhFormField({
    id,
    label,
    required,
    error,
    hint,
    children,
    className = "",
}: QhFormFieldProps) {
    return (
        <div className={["flex flex-col gap-1.5", className].join(" ")}>
            {label !== undefined && (
                <label
                    htmlFor={id}
                    className="text-xs font-bold uppercase tracking-wider text-[var(--qh-muted)]"
                >
                    {label}
                    {required && (
                        <span className="ml-1 text-[var(--qh-error)]" aria-hidden="true">
                            *
                        </span>
                    )}
                </label>
            )}
            {children}
            {error && (
                <span
                    className="text-xs text-[var(--qh-error)] flex items-center gap-1"
                    aria-live="polite"
                >
                    {error}
                </span>
            )}
            {!error && hint && (
                <span className="text-xs text-[var(--qh-muted)]">{hint}</span>
            )}
        </div>
    );
}
