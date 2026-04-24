import { useRef, useEffect } from "react";
import { useUserProfileForm } from "keycloakify/login/lib/useUserProfileForm";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import { VgFormField } from "@keycloak-theme/shared/ui";
import GroupLabel from "./elements/GroupLabel";
import InputFieldByType from "./elements/InputFieldByType";

export default function UserProfileFormFields(props: UserProfileFormFieldsProps<KcContext, I18n>) {
    const {
        kcContext,
        i18n,
        kcClsx,
        onIsFormSubmittableValueChange,
        doMakeUserConfirmPassword,
        BeforeField,
        AfterField,
    } = props;

    const { advancedMsg } = i18n;

    const { formState, dispatchFormAction } = useUserProfileForm({
        kcContext,
        i18n,
        doMakeUserConfirmPassword,
    });
    const { formFieldStates, isFormSubmittable } = formState;

    useEffect(() => {
        onIsFormSubmittableValueChange(isFormSubmittable);
    }, [isFormSubmittable, onIsFormSubmittableValueChange]);

    const groupNameRef = useRef<string>("");

    return (
        <>
            {formFieldStates.map(({ attribute, displayableErrors, valueOrValues }) => {
                // Skip hidden fields that shouldn't be shown in UI
                if (
                    attribute.name === "password-confirm" && !doMakeUserConfirmPassword
                ) {
                    return null;
                }

                return (
                    <div key={attribute.name}>
                        {/* Group section header */}
                        <GroupLabel
                            attribute={attribute}
                            groupNameRef={groupNameRef}
                            i18n={i18n}
                        />

                        {/* Before-field hook */}
                        {BeforeField !== undefined && (
                            <BeforeField
                                attribute={attribute}
                                dispatchFormAction={dispatchFormAction}
                                displayableErrors={displayableErrors}
                                valueOrValues={valueOrValues}
                                kcClsx={kcClsx}
                                i18n={i18n}
                            />
                        )}

                        {/* The field itself — wrapped in VgFormField for label/error */}
                        <VgFormField
                            id={attribute.name}
                            label={
                                attribute.annotations.inputType !== "select-radiobuttons" &&
                                attribute.annotations.inputType !== "multiselect-checkboxes"
                                    ? advancedMsg(attribute.displayName ?? attribute.name)
                                    : undefined
                            }
                            required={attribute.required}
                            className="mb-4"
                        >
                            <InputFieldByType
                                attribute={attribute}
                                valueOrValues={valueOrValues}
                                displayableErrors={displayableErrors}
                                dispatchFormAction={dispatchFormAction}
                                i18n={i18n}
                            />
                        </VgFormField>

                        {/* After-field hook */}
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
                );
            })}

            {/* Hidden locale field */}
            {formFieldStates.find(({ attribute }) => attribute.name === "locale") && (
                <input
                    type="hidden"
                    name="locale"
                    value={i18n.currentLanguage.languageTag}
                />
            )}
        </>
    );
}
