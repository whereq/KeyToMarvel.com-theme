import { useEffect, Fragment } from "react";
import { useUserProfileForm } from "keycloakify/login/lib/useUserProfileForm";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import type { KcContext } from "@/keycloak-theme/layout/KcContext";
import type { I18n } from "@/keycloak-theme/layout/i18n";
import GroupLabel from "@keycloak-theme/profile/elements/GroupLabel";
import InputFieldWrapper from "@keycloak-theme/profile/elements/InputFieldWrapper";

export default function UserProfileFormFields(props: UserProfileFormFieldsProps<KcContext, I18n>) {
    const { kcContext, i18n, kcClsx, onIsFormSubmittableValueChange, doMakeUserConfirmPassword, BeforeField, AfterField } = props;

    const {
        formState: { formFieldStates, isFormSubmittable },
        dispatchFormAction
    } = useUserProfileForm({
        kcContext,
        i18n,
        doMakeUserConfirmPassword
    });

    useEffect(() => {
        onIsFormSubmittableValueChange(isFormSubmittable);
    }, [isFormSubmittable, onIsFormSubmittableValueChange]);

    const groupNameRef = { current: "" };

    return (
        <>
            {formFieldStates.map(({ attribute, displayableErrors, valueOrValues }) => (
                <Fragment key={attribute.name}>
                    <GroupLabel attribute={attribute} groupNameRef={groupNameRef} i18n={i18n} kcClsx={kcClsx} />
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
                    <InputFieldWrapper
                        attribute={attribute}
                        displayableErrors={displayableErrors}
                        valueOrValues={valueOrValues}
                        dispatchFormAction={dispatchFormAction}
                        kcClsx={kcClsx}
                        i18n={i18n}
                        doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                        AfterField={AfterField}
                    />
                </Fragment>
            ))}
            {kcContext.locale !== undefined && formFieldStates.find(x => x.attribute.name === "locale") === undefined && (
                <input type="hidden" name="locale" value={i18n.currentLanguage.languageTag} />
            )}
        </>
    );
}