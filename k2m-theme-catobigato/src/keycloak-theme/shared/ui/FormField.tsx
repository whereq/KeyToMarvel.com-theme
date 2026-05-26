import type { ReactNode } from "react";

export interface CbFormFieldProps {
    id?: string;
    label?: ReactNode;
    required?: boolean;
    error?: ReactNode;
    hint?: ReactNode;
    children: ReactNode;
    className?: string;
}

export function CbFormField({
    id,
    label,
    required,
    error,
    hint,
    children,
    className = "",
}: CbFormFieldProps) {
    return (
        <div className={["flex flex-col gap-1.5", className].join(" ")}>
            {label !== undefined && (
                <label
                    htmlFor={id}
                    className="text-sm font-medium text-[var(--cb-text-secondary)]"
                >
                    {label}
                    {required && (
                        <span className="ml-1 text-[var(--cb-error)]" aria-hidden="true">
                            *
                        </span>
                    )}
                </label>
            )}
            {children}
            {error && (
                <span
                    className="text-xs text-[var(--cb-error)] flex items-center gap-1"
                    aria-live="polite"
                >
                    {error}
                </span>
            )}
            {!error && hint && (
                <span className="text-xs text-[var(--cb-text-muted)]">{hint}</span>
            )}
        </div>
    );
}
