import { Fragment } from "react";
import type { KcClsx } from "keycloakify/login/lib/kcClsx";
import type { Attribute } from "keycloakify/login/KcContext";
import type { FormFieldError } from "keycloakify/login/lib/useUserProfileForm";

export default function FieldErrors(props: { attribute: Attribute; displayableErrors: FormFieldError[]; fieldIndex: number | undefined; kcClsx: KcClsx }) {
    const { attribute, fieldIndex } = props;
    const displayableErrors = props.displayableErrors.filter(error => error.fieldIndex === fieldIndex);

    if (displayableErrors.length === 0) {
        return null;
    }

    return (
        <span
            id={`input-error-${attribute.name}${fieldIndex === undefined ? "" : `-${fieldIndex}`}`}
            className="block w-full mt-1 bg-gray-800 text-red-700 rounded-sm border-gray-600"
            aria-live="polite"
        >
            {displayableErrors.map(({ errorMessage }, i, arr) => (
                <Fragment key={i}>
                    {errorMessage}
                    {arr.length - 1 !== i && <br />}
                </Fragment>
            ))}
        </span>
    );
}