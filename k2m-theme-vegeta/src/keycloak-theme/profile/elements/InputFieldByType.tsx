import type { Attribute } from "keycloakify/login/KcContext";
import type { FormAction, FormFieldError } from "keycloakify/login/lib/useUserProfileForm";
import type { I18n } from "@keycloak-theme/layout/i18n";
import InputTag from "./InputTag";
import SelectTag from "./SelectTag";
import TextareaTag from "./TextareaTag";
import InputTagSelects from "./InputTagSelects";
import { VgPasswordInput, VgAvatarUpload } from "@keycloak-theme/shared/ui";
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
            // ── Avatar field — custom upload widget ──────────────────────────
            // Keycloak stores the avatar as a string attribute (URL or base64).
            // Social-provider login (Google, WeChat) may pre-populate it with a
            // picture URL.  Uploaded images are compressed client-side to ≤16 KB.
            //
            // Storage note: base64 payloads (~21 KB text) exceed Keycloak's
            // default USER_ATTRIBUTE.VALUE column (varchar 255).  For production:
            //   • Alter the column to TEXT, OR
            //   • Implement the k2m avatar API (see AvatarUpload.tsx TODO) so
            //     only the returned URL (~100 chars) is stored in the attribute.
            if (attribute.name === "avatar") {
                const currentVal =
                    typeof valueOrValues === "string"
                        ? valueOrValues
                        : (valueOrValues[0] ?? "");

                return (
                    <div className="flex flex-col gap-1">
                        <VgAvatarUpload
                            currentValue={currentVal}
                            hasError={displayableErrors.length > 0}
                            onChange={value =>
                                dispatchFormAction({
                                    action: "update",
                                    name: attribute.name,
                                    valueOrValues: value,
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
