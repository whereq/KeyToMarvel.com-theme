import type { Attribute } from "keycloakify/login/KcContext";
import type { FormAction, FormFieldError } from "keycloakify/login/lib/useUserProfileForm";
import type { I18n } from "@keycloak-theme/layout/i18n";
import { CbInput } from "@keycloak-theme/shared/ui";
import AddRemoveButtonsMultiValuedAttribute from "./AddRemoveButtonsMultiValuedAttribute";
import FieldErrors from "./FieldErrors";

export default function InputTag(props: {
    attribute: Attribute;
    fieldIndex: number | undefined;
    valueOrValues: string | string[];
    displayableErrors: FormFieldError[];
    dispatchFormAction: (action: FormAction) => void;
    i18n: I18n;
}) {
    const { attribute, fieldIndex, valueOrValues, displayableErrors, dispatchFormAction, i18n } = props;
    const { advancedMsgStr } = i18n;

    const inputType = (() => {
        const raw = attribute.annotations.inputType;
        if (raw === undefined) return "text";
        const stripped = raw.replace(/^html5-/, "");
        return stripped === "password" || stripped === "password-confirm" ? "password" : stripped;
    })();

    const value = Array.isArray(valueOrValues)
        ? (valueOrValues[fieldIndex ?? 0] ?? "")
        : valueOrValues;

    const hasError = displayableErrors.some(
        e => fieldIndex === undefined || e.fieldIndex === undefined || e.fieldIndex === fieldIndex,
    );

    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
                <CbInput
                    type={inputType}
                    id={fieldIndex === undefined ? attribute.name : `${attribute.name}-${fieldIndex}`}
                    name={attribute.name}
                    value={value}
                    placeholder={
                        `${advancedMsgStr(attribute.displayName ?? attribute.name)}${attribute.required ? " *" : ""}`
                    }
                    autoComplete={attribute.autocomplete}
                    readOnly={attribute.readOnly}
                    disabled={attribute.readOnly}
                    hasError={hasError}
                    aria-invalid={hasError}
                    pattern={attribute.annotations.inputTypePattern}
                    size={
                        attribute.annotations.inputTypeSize !== undefined
                            ? Number(attribute.annotations.inputTypeSize)
                            : undefined
                    }
                    maxLength={
                        attribute.annotations.inputTypeMaxlength !== undefined
                            ? Number(attribute.annotations.inputTypeMaxlength)
                            : undefined
                    }
                    minLength={
                        attribute.annotations.inputTypeMinlength !== undefined
                            ? Number(attribute.annotations.inputTypeMinlength)
                            : undefined
                    }
                    {...Object.fromEntries(
                        Object.entries(attribute.html5DataAnnotations ?? {}).map(([k, v]) => [
                            `data-${k}`,
                            v,
                        ]),
                    )}
                    onChange={e =>
                        dispatchFormAction({
                            action: "update",
                            name: attribute.name,
                            valueOrValues: Array.isArray(valueOrValues)
                                ? valueOrValues.map((v, i) => (i === (fieldIndex ?? 0) ? e.target.value : v))
                                : e.target.value,
                        })
                    }
                    onBlur={() =>
                        dispatchFormAction({
                            action: "focus lost",
                            name: attribute.name,
                            fieldIndex: fieldIndex ?? 0,
                        })
                    }
                />
                {Array.isArray(valueOrValues) && fieldIndex !== undefined && (
                    <AddRemoveButtonsMultiValuedAttribute
                        attribute={attribute}
                        values={valueOrValues}
                        fieldIndex={fieldIndex}
                        dispatchFormAction={dispatchFormAction}
                        i18n={i18n}
                    />
                )}
            </div>
            <FieldErrors fieldErrors={displayableErrors} fieldIndex={fieldIndex} />
        </div>
    );
}
