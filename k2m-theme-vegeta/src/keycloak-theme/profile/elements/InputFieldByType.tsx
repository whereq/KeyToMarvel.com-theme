import type { Attribute } from "keycloakify/login/KcContext";
import type { FormAction, FormFieldError } from "keycloakify/login/lib/useUserProfileForm";
import type { I18n } from "@keycloak-theme/layout/i18n";
import InputTag from "./InputTag";
import SelectTag from "./SelectTag";
import TextareaTag from "./TextareaTag";
import InputTagSelects from "./InputTagSelects";
import { VgPasswordInput } from "@keycloak-theme/shared/ui";
import FieldErrors from "./FieldErrors";

export default function InputFieldByType(props: {
    attribute: Attribute;
    valueOrValues: string | string[];
    displayableErrors: FormFieldError[];
    dispatchFormAction: (action: FormAction) => void;
    i18n: I18n;
}) {
    const { attribute, valueOrValues, displayableErrors, dispatchFormAction, i18n } = props;

    const inputType = attribute.annotations.inputType;

    switch (inputType) {
        case "textarea":
            return (
                <TextareaTag
                    attribute={attribute}
                    valueOrValues={valueOrValues}
                    displayableErrors={displayableErrors}
                    dispatchFormAction={dispatchFormAction}
                    i18n={i18n}
                />
            );

        case "select":
        case "multiselect":
            return (
                <SelectTag
                    attribute={attribute}
                    valueOrValues={valueOrValues}
                    displayableErrors={displayableErrors}
                    dispatchFormAction={dispatchFormAction}
                    i18n={i18n}
                />
            );

        case "select-radiobuttons":
        case "multiselect-checkboxes":
            return (
                <InputTagSelects
                    attribute={attribute}
                    valueOrValues={valueOrValues}
                    displayableErrors={displayableErrors}
                    dispatchFormAction={dispatchFormAction}
                    i18n={i18n}
                />
            );

        default: {
            // Multi-valued string input
            if (Array.isArray(valueOrValues)) {
                return (
                    <>
                        {valueOrValues.map((_, fieldIndex) => (
                            <InputTag
                                key={fieldIndex}
                                attribute={attribute}
                                fieldIndex={fieldIndex}
                                valueOrValues={valueOrValues}
                                displayableErrors={displayableErrors}
                                dispatchFormAction={dispatchFormAction}
                                i18n={i18n}
                            />
                        ))}
                    </>
                );
            }

            // Password field (single)
            if (inputType === "password" || inputType === "password-confirm") {
                const hasError = displayableErrors.length > 0;
                return (
                    <div className="flex flex-col gap-1">
                        <VgPasswordInput
                            id={attribute.name}
                            name={attribute.name}
                            hasError={hasError}
                            aria-invalid={hasError}
                            autoComplete={attribute.autocomplete ?? "current-password"}
                            onChange={e =>
                                dispatchFormAction({
                                    action: "update",
                                    name: attribute.name,
                                    valueOrValues: e.target.value,
                                })
                            }
                            onBlur={() =>
                                dispatchFormAction({
                                    action: "focus lost",
                                    name: attribute.name,
                                    fieldIndex: 0,
                                })
                            }
                        />
                        <FieldErrors fieldErrors={displayableErrors} fieldIndex={undefined} />
                    </div>
                );
            }

            // Default single-value input
            return (
                <InputTag
                    attribute={attribute}
                    fieldIndex={undefined}
                    valueOrValues={valueOrValues}
                    displayableErrors={displayableErrors}
                    dispatchFormAction={dispatchFormAction}
                    i18n={i18n}
                />
            );
        }
    }
}
