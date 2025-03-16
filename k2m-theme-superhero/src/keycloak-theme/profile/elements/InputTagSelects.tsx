import type { KcClsx } from "keycloakify/login/lib/kcClsx";
import type { Attribute } from "keycloakify/login/KcContext";
import type { I18n } from "@/keycloak-theme/layout/i18n";
import type { FormAction, FormFieldError } from "keycloakify/login/lib/useUserProfileForm";
import { assert } from "keycloakify/tools/assert";
import { inputLabel } from "@keycloak-theme/profile/utils";

export default function InputTagSelects(props: {
    attribute: Attribute;
    valueOrValues: string | string[];
    displayableErrors: FormFieldError[];
    dispatchFormAction: React.Dispatch<FormAction>;
    i18n: I18n;
    kcClsx: KcClsx;
}) {
    const { attribute, dispatchFormAction, kcClsx, i18n, valueOrValues } = props;

    const { classDiv, classInput, classLabel, inputType } = (() => {
        const { inputType } = attribute.annotations;
        assert(inputType === "select-radiobuttons" || inputType === "multiselect-checkboxes");
        return inputType === "select-radiobuttons"
            ? {
                  inputType: "radio",
                  classDiv: kcClsx("kcInputClassRadio"),
                  classInput: kcClsx("kcInputClassRadioInput"),
                  classLabel: kcClsx("kcInputClassRadioLabel")
              }
            : {
                  inputType: "checkbox",
                  classDiv: kcClsx("kcInputClassCheckbox"),
                  classInput: kcClsx("kcInputClassCheckboxInput"),
                  classLabel: kcClsx("kcInputClassCheckboxLabel")
              };
    })();

    const options = (() => {
        const { inputOptionsFromValidation } = attribute.annotations;
        if (inputOptionsFromValidation) {
            const validator = (attribute.validators as Record<string, { options?: string[] }>)[inputOptionsFromValidation];
            if (validator?.options) return validator.options;
        }
        return attribute.validators.options?.options ?? [];
    })();

    return (
        <>
            {options.map(option => (
                <div key={option} className={classDiv}>
                    <input
                        type={inputType}
                        id={`${attribute.name}-${option}`}
                        name={attribute.name}
                        value={option}
                        className={classInput}
                        aria-invalid={props.displayableErrors.length !== 0}
                        disabled={attribute.readOnly}
                        checked={valueOrValues instanceof Array ? valueOrValues.includes(option) : valueOrValues === option}
                        onChange={event =>
                            dispatchFormAction({
                                action: "update",
                                name: attribute.name,
                                valueOrValues: (() => {
                                    const isChecked = event.target.checked;
                                    if (valueOrValues instanceof Array) {
                                        const newValues = [...valueOrValues];
                                        if (isChecked) newValues.push(option);
                                        else newValues.splice(newValues.indexOf(option), 1);
                                        return newValues;
                                    }
                                    return isChecked ? option : "";
                                })()
                            })
                        }
                        onBlur={() =>
                            dispatchFormAction({
                                action: "focus lost",
                                name: attribute.name,
                                fieldIndex: undefined
                            })
                        }
                    />
                    <label
                        htmlFor={`${attribute.name}-${option}`}
                        className={`${classLabel}${attribute.readOnly ? ` ${kcClsx("kcInputClassRadioCheckboxLabelDisabled")}` : ""}`}
                    >
                        {inputLabel(i18n, attribute, option)}
                    </label>
                </div>
            ))}
        </>
    );
}