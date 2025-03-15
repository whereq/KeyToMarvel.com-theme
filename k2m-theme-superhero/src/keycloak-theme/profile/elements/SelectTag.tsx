import type { KcClsx } from "keycloakify/login/lib/kcClsx";
import type { Attribute } from "keycloakify/login/KcContext";
import type { I18n } from "@keycloak-theme/login/i18n";
import type { FormAction, FormFieldError } from "keycloakify/login/lib/useUserProfileForm";
import { assert } from "keycloakify/tools/assert";
import { inputLabel } from "@keycloak-theme/profile/utils";

export default function SelectTag(props: {
    attribute: Attribute;
    valueOrValues: string | string[];
    displayableErrors: FormFieldError[];
    dispatchFormAction: React.Dispatch<FormAction>;
    i18n: I18n;
    kcClsx: KcClsx;
}) {
    const { attribute, dispatchFormAction, kcClsx, displayableErrors, i18n, valueOrValues } = props;
    const isMultiple = attribute.annotations.inputType === "multiselect";

    return (
        <select
            id={attribute.name}
            name={attribute.name}
            className={kcClsx("kcInputClass")}
            aria-invalid={displayableErrors.length !== 0}
            disabled={attribute.readOnly}
            multiple={isMultiple}
            size={attribute.annotations.inputTypeSize === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeSize}`)}
            value={valueOrValues}
            onChange={event =>
                dispatchFormAction({
                    action: "update",
                    name: attribute.name,
                    valueOrValues: (() => {
                        if (isMultiple) {
                            return Array.from(event.target.selectedOptions).map(option => option.value);
                        }
                        return event.target.value;
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
        >
            {!isMultiple && <option value=""></option>}
            {(() => {
                const options = (() => {
                    const { inputOptionsFromValidation } = attribute.annotations;
                    if (inputOptionsFromValidation) {
                        assert(typeof inputOptionsFromValidation === "string");
                        const validator = (attribute.validators as Record<string, { options?: string[] }>)[inputOptionsFromValidation];
                        if (validator?.options) return validator.options;
                    }
                    return attribute.validators.options?.options ?? [];
                })();
                return options.map(option => (
                    <option key={option} value={option}>
                        {inputLabel(i18n, attribute, option)}
                    </option>
                ));
            })()}
        </select>
    );
}