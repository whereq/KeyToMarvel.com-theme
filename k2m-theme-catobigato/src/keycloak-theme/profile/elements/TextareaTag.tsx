import type { Attribute } from "keycloakify/login/KcContext";
import type { FormAction, FormFieldError } from "keycloakify/login/lib/useUserProfileForm";
import type { I18n } from "@keycloak-theme/layout/i18n";
import { CbTextarea } from "@keycloak-theme/shared/ui";
import FieldErrors from "./FieldErrors";

export default function TextareaTag(props: {
    attribute: Attribute;
    valueOrValues: string | string[];
    displayableErrors: FormFieldError[];
    dispatchFormAction: (action: FormAction) => void;
    i18n: I18n;
}) {
    const { attribute, valueOrValues, displayableErrors, dispatchFormAction } = props;
    const value = Array.isArray(valueOrValues) ? valueOrValues[0] ?? "" : valueOrValues;
    const hasError = displayableErrors.length > 0;

    return (
        <div className="flex flex-col gap-1">
            <CbTextarea
                id={attribute.name}
                name={attribute.name}
                value={value}
                rows={attribute.annotations.inputTypeRows !== undefined ? Number(attribute.annotations.inputTypeRows) : 3}
                cols={attribute.annotations.inputTypeCols !== undefined ? Number(attribute.annotations.inputTypeCols) : undefined}
                maxLength={attribute.annotations.inputTypeMaxlength !== undefined ? Number(attribute.annotations.inputTypeMaxlength) : undefined}
                readOnly={attribute.readOnly}
                disabled={attribute.readOnly}
                hasError={hasError}
                aria-invalid={hasError}
                onChange={e =>
                    dispatchFormAction({ action: "update", name: attribute.name, valueOrValues: e.target.value })
                }
                onBlur={() =>
                    dispatchFormAction({ action: "focus lost", name: attribute.name, fieldIndex: 0 })
                }
            />
            <FieldErrors fieldErrors={displayableErrors} fieldIndex={undefined} />
        </div>
    );
}
