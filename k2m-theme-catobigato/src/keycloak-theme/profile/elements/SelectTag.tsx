import type { Attribute } from "keycloakify/login/KcContext";
import type { FormAction, FormFieldError } from "keycloakify/login/lib/useUserProfileForm";
import type { I18n } from "@keycloak-theme/layout/i18n";
import { CbSelect } from "@keycloak-theme/shared/ui";
import { inputLabel } from "../utils";
import FieldErrors from "./FieldErrors";

export default function SelectTag(props: {
    attribute: Attribute;
    valueOrValues: string | string[];
    displayableErrors: FormFieldError[];
    dispatchFormAction: (action: FormAction) => void;
    i18n: I18n;
}) {
    const { attribute, valueOrValues, displayableErrors, dispatchFormAction, i18n } = props;

    const isMultiple = attribute.annotations.inputType === "multiselect";
    const hasError = displayableErrors.length > 0;

    const options: string[] = (() => {
        const fromValidation = attribute.validators?.options?.options;
        if (fromValidation) return fromValidation;
        return [];
    })();

    return (
        <div className="flex flex-col gap-1">
            <CbSelect
                id={attribute.name}
                name={attribute.name}
                multiple={isMultiple}
                hasError={hasError}
                size={
                    attribute.annotations.inputTypeSize !== undefined
                        ? Number(attribute.annotations.inputTypeSize)
                        : undefined
                }
                value={isMultiple ? (Array.isArray(valueOrValues) ? valueOrValues : [valueOrValues]) : (Array.isArray(valueOrValues) ? valueOrValues[0] : valueOrValues)}
                onChange={e => {
                    const select = e.target as HTMLSelectElement;
                    const selected = isMultiple
                        ? Array.from(select.selectedOptions).map(o => o.value)
                        : select.value;
                    dispatchFormAction({
                        action: "update",
                        name: attribute.name,
                        valueOrValues: selected,
                    });
                }}
                onBlur={() =>
                    dispatchFormAction({ action: "focus lost", name: attribute.name, fieldIndex: 0 })
                }
            >
                {!isMultiple && <option value="" />}
                {options.map(option => (
                    <option key={option} value={option}>
                        {inputLabel(i18n, attribute, option)}
                    </option>
                ))}
            </CbSelect>
            <FieldErrors fieldErrors={displayableErrors} fieldIndex={undefined} />
        </div>
    );
}
