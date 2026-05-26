import type { Attribute } from "keycloakify/login/KcContext";
import type { FormAction, FormFieldError } from "keycloakify/login/lib/useUserProfileForm";
import type { I18n } from "@keycloak-theme/layout/i18n";
import { inputLabel } from "../utils";
import FieldErrors from "./FieldErrors";

export default function InputTagSelects(props: {
    attribute: Attribute;
    valueOrValues: string | string[];
    displayableErrors: FormFieldError[];
    dispatchFormAction: (action: FormAction) => void;
    i18n: I18n;
}) {
    const { attribute, valueOrValues, displayableErrors, dispatchFormAction, i18n } = props;

    const isMultiple = attribute.annotations.inputType === "multiselect-checkboxes";
    const type = isMultiple ? "checkbox" : "radio";

    const options: string[] = attribute.validators?.options?.options ?? [];

    const currentValues = Array.isArray(valueOrValues) ? valueOrValues : [valueOrValues];

    return (
        <div className="flex flex-col gap-2">
            {options.map(option => (
                <label
                    key={option}
                    className="flex items-center gap-2.5 cursor-pointer"
                >
                    <input
                        type={type}
                        id={`${attribute.name}-${option}`}
                        name={attribute.name}
                        value={option}
                        checked={currentValues.includes(option)}
                        readOnly={attribute.readOnly}
                        disabled={attribute.readOnly}
                        style={{ accentColor: "var(--cb-orange-500)" }}
                        onChange={e => {
                            if (isMultiple) {
                                dispatchFormAction({
                                    action: "update",
                                    name: attribute.name,
                                    valueOrValues: e.target.checked
                                        ? [...currentValues, option]
                                        : currentValues.filter(v => v !== option),
                                });
                            } else {
                                dispatchFormAction({
                                    action: "update",
                                    name: attribute.name,
                                    valueOrValues: option,
                                });
                            }
                        }}
                        onBlur={() =>
                            dispatchFormAction({ action: "focus lost", name: attribute.name, fieldIndex: 0 })
                        }
                    />
                    <span style={{ fontSize: "0.875rem", color: "var(--cb-text-secondary)" }}>
                        {inputLabel(i18n, attribute, option)}
                    </span>
                </label>
            ))}
            <FieldErrors fieldErrors={displayableErrors} fieldIndex={undefined} />
        </div>
    );
}
