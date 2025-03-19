import type { JSX } from "keycloakify/tools/JSX";
import type { KcClsx } from "keycloakify/login/lib/kcClsx";
import type { Attribute } from "keycloakify/login/KcContext";
import type { I18n } from "@/keycloak-theme/layout/i18n";
import type { FormAction, FormFieldError } from "keycloakify/login/lib/useUserProfileForm";
import InputFieldByType from "@/keycloak-theme/profile/elements/InputFieldByType";
import FieldErrors from "@keycloak-theme/profile/elements/FieldErrors";

export default function InputFieldWrapper(props: {
    attribute: Attribute;
    valueOrValues: string | string[];
    displayableErrors: FormFieldError[];
    dispatchFormAction: React.Dispatch<FormAction>;
    kcClsx: KcClsx;
    i18n: I18n;
    doMakeUserConfirmPassword: boolean;
    AfterField?: (props: {
        attribute: Attribute;
        dispatchFormAction: React.Dispatch<FormAction>;
        displayableErrors: FormFieldError[];
        valueOrValues: string | string[];
        kcClsx: KcClsx;
        i18n: I18n;
    }) => JSX.Element | null;
}) {
    const { attribute, valueOrValues, displayableErrors, dispatchFormAction, kcClsx, i18n, doMakeUserConfirmPassword, AfterField } = props;
    const { advancedMsg } = i18n;

    // Check if the input type is "select" or "multiselect"
    const isSelectOrMultiselect = 
        attribute.annotations.inputType === "select" || attribute.annotations.inputType === "multiselect";

    return (
        <div
            className={kcClsx("kcFormGroupClass")}
            style={{
                display: attribute.name === "password-confirm" && !doMakeUserConfirmPassword ? "none" : undefined
            }}
        >
            <div className="w-full rounded-sm">
                {attribute.annotations.inputHelperTextBefore !== undefined && (
                    <div
                        className={kcClsx("kcInputHelperTextBeforeClass")}
                        id={`form-help-text-before-${attribute.name}`}
                        aria-live="polite"
                    >
                        {advancedMsg(attribute.annotations.inputHelperTextBefore)}
                    </div>
                )}

                {/* Add label for select or multiselect fields */}
                {isSelectOrMultiselect && (
                    <div className="flex items-center space-x-4">
                        <div className="w-36"> {/* Fixed width for label to ensure alignment */}
                            <label htmlFor={attribute.name} className="font-bold text-orange-400">
                                {advancedMsg(attribute.displayName ?? "")}
                                {attribute.required && <> *</>}
                            </label>
                        </div>
                        <div className="flex-1">
                            <InputFieldByType
                                attribute={attribute}
                                valueOrValues={valueOrValues}
                                displayableErrors={displayableErrors}
                                dispatchFormAction={dispatchFormAction}
                                kcClsx={kcClsx}
                                i18n={i18n}
                            />
                        </div>
                    </div>
                )}

                {/* Default input field rendering for non-select fields */}
                {!isSelectOrMultiselect && (
                    <InputFieldByType
                        attribute={attribute}
                        valueOrValues={valueOrValues}
                        displayableErrors={displayableErrors}
                        dispatchFormAction={dispatchFormAction}
                        kcClsx={kcClsx}
                        i18n={i18n}
                    />
                )}

                <FieldErrors attribute={attribute} displayableErrors={displayableErrors} kcClsx={kcClsx} fieldIndex={undefined} />
                {attribute.annotations.inputHelperTextAfter !== undefined && (
                    <div
                        className="w-full border-1 mt-10 bg-gray-800 text-red-700 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        id={`form-help-text-after-${attribute.name}`}
                        aria-live="polite"
                    >
                        {advancedMsg(attribute.annotations.inputHelperTextAfter)}
                    </div>
                )}
                {AfterField !== undefined && (
                    <AfterField
                        attribute={attribute}
                        dispatchFormAction={dispatchFormAction}
                        displayableErrors={displayableErrors}
                        valueOrValues={valueOrValues}
                        kcClsx={kcClsx}
                        i18n={i18n}
                    />
                )}
            </div>
        </div>
    );
}