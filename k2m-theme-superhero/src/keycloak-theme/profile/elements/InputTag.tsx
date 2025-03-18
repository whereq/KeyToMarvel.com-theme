import { assert } from "keycloakify/tools/assert";
import type { KcClsx } from "keycloakify/login/lib/kcClsx";
import type { Attribute } from "keycloakify/login/KcContext";
import type { I18n } from "@/keycloak-theme/layout/i18n";
import type { FormAction, FormFieldError } from "keycloakify/login/lib/useUserProfileForm";
import FieldErrors from "@keycloak-theme/profile/elements/FieldErrors";
import AddRemoveButtonsMultiValuedAttribute from "@keycloak-theme/profile/elements/AddRemoveButtonsMultiValuedAttribute";

export default function InputTag(props: {
    attribute: Attribute;
    valueOrValues: string | string[];
    displayableErrors: FormFieldError[];
    dispatchFormAction: React.Dispatch<FormAction>;
    i18n: I18n;
    kcClsx: KcClsx;
    fieldIndex: number | undefined;
}) {
    const { attribute, fieldIndex, kcClsx, dispatchFormAction, valueOrValues, i18n, displayableErrors } = props;
    const { advancedMsgStr } = i18n;

    return (
        <>
            <input
                type={(() => {
                    const { inputType } = attribute.annotations;
                    if (inputType?.startsWith("html5-")) {
                        return inputType.slice(6);
                    }
                    return inputType ?? "text";
                })()}
                id={attribute.name}
                name={attribute.name}
                value={(() => {
                    if (fieldIndex !== undefined) {
                        assert(valueOrValues instanceof Array);
                        return valueOrValues[fieldIndex];
                    }
                    assert(typeof valueOrValues === "string");
                    return valueOrValues;
                })()}
                className="w-full px-3 py-2 bg-gray-700 text-gray-200 
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-invalid={displayableErrors.find(error => error.fieldIndex === fieldIndex) !== undefined}
                disabled={attribute.readOnly}
                autoComplete={attribute.autocomplete}
                placeholder={
                    (attribute.annotations.inputTypePlaceholder === undefined
                        ? advancedMsgStr(attribute.displayName ?? attribute.name)
                        : advancedMsgStr(attribute.annotations.inputTypePlaceholder)) + (attribute.required ? " *" : "")
                }
                pattern={attribute.annotations.inputTypePattern}
                size={attribute.annotations.inputTypeSize === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeSize}`)}
                maxLength={attribute.annotations.inputTypeMaxlength === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeMaxlength}`)}
                minLength={attribute.annotations.inputTypeMinlength === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeMinlength}`)}
                max={attribute.annotations.inputTypeMax}
                min={attribute.annotations.inputTypeMin}
                step={attribute.annotations.inputTypeStep}
                {...Object.fromEntries(Object.entries(attribute.html5DataAnnotations ?? {}).map(([key, value]) => [`data-${key}`, value]))}
                onChange={event =>
                    dispatchFormAction({
                        action: "update",
                        name: attribute.name,
                        valueOrValues: (() => {
                            if (fieldIndex !== undefined) {
                                assert(valueOrValues instanceof Array);
                                return valueOrValues.map((value, i) => (i === fieldIndex ? event.target.value : value));
                            }
                            return event.target.value;
                        })()
                    })
                }
                onBlur={() =>
                    dispatchFormAction({
                        action: "focus lost",
                        name: attribute.name,
                        fieldIndex: fieldIndex
                    })
                }
            />
            {(() => {
                if (fieldIndex === undefined) {
                    return null;
                }
                assert(valueOrValues instanceof Array);
                const values = valueOrValues;
                return (
                    <>
                        <FieldErrors attribute={attribute} kcClsx={kcClsx} displayableErrors={displayableErrors} fieldIndex={fieldIndex} />
                        <AddRemoveButtonsMultiValuedAttribute
                            attribute={attribute}
                            values={values}
                            fieldIndex={fieldIndex}
                            dispatchFormAction={dispatchFormAction}
                            i18n={i18n}
                        />
                    </>
                );
            })()}
        </>
    );
}