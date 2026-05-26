import type { FormFieldError } from "keycloakify/login/lib/useUserProfileForm";

export default function FieldErrors(props: {
    fieldErrors: FormFieldError[];
    fieldIndex: number | undefined;
}) {
    const { fieldErrors, fieldIndex } = props;

    const filtered =
        fieldIndex === undefined
            ? fieldErrors
            : fieldErrors.filter(e => e.fieldIndex === undefined || e.fieldIndex === fieldIndex);

    if (filtered.length === 0) return null;

    return (
        <span
            aria-live="polite"
            style={{ display: "block", fontSize: "0.75rem", color: "var(--cb-error)", marginTop: 4 }}
        >
            {filtered.map((e, i) => (
                <span key={i}>
                    {e.errorMessage}
                    {i < filtered.length - 1 && <br />}
                </span>
            ))}
        </span>
    );
}
