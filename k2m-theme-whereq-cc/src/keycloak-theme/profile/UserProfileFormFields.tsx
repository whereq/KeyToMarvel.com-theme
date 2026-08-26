import { useEffect, Fragment } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import { FdInput, FdPasswordInput, FdFormField, FdCheckbox } from "@keycloak-theme/shared/ui";
import { useUserProfileForm } from "keycloakify/login/lib/useUserProfileForm";

export default function UserProfileFormFields({
    kcContext,
    i18n,
    onIsFormSubmittableValueChange,
    doMakeUserConfirmPassword,
}: UserProfileFormFieldsProps<KcContext, I18n>) {
    const { advancedMsg } = i18n;

    const {
        formState: { formFieldStates, isFormSubmittable },
        dispatchFormAction,
    } = useUserProfileForm({ kcContext, i18n, doMakeUserConfirmPassword });

    useEffect(() => {
        onIsFormSubmittableValueChange(isFormSubmittable);
    }, [isFormSubmittable, onIsFormSubmittableValueChange]);

    return (
        <>
            {formFieldStates.map(({ attribute, displayableErrors, valueOrValues }) => {
                const isPasswordField =
                    attribute.name === "password" || attribute.name === "password-confirm";
                const hasError = displayableErrors.length > 0;

                return (
                    <Fragment key={attribute.name}>
                        <FdFormField
                            id={attribute.name}
                            label={advancedMsg(attribute.displayName ?? attribute.name)}
                            required={attribute.required}
                            error={
                                hasError ? (
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: kcSanitize(
                                                displayableErrors.map(e => e.errorMessage).join(", "),
                                            ),
                                        }}
                                    />
                                ) : undefined
                            }
                        >
                            {isPasswordField ? (
                                <FdPasswordInput
                                    id={attribute.name}
                                    name={attribute.name}
                                    autoComplete={
                                        attribute.name === "password"
                                            ? "new-password"
                                            : "new-password"
                                    }
                                    hasError={hasError}
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
                                            fieldIndex: undefined,
                                        })
                                    }
                                />
                            ) : attribute.annotations?.inputType === "select" ? (
                                <select
                                    id={attribute.name}
                                    name={attribute.name}
                                    defaultValue={valueOrValues as string}
                                    style={{
                                        width: "100%",
                                        padding: "10px 12px",
                                        background: "var(--fd-bg-elevated)",
                                        color: "var(--fd-text-primary)",
                                        border: `1px solid ${hasError ? "var(--fd-error)" : "var(--fd-border-default)"}`,
                                        fontSize: "0.875rem",
                                    }}
                                    onChange={e =>
                                        dispatchFormAction({
                                            action: "update",
                                            name: attribute.name,
                                            valueOrValues: e.target.value,
                                        })
                                    }
                                >
                                    {attribute.validators?.options?.options?.map((opt: string) => (
                                        <option key={opt} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                            ) : attribute.annotations?.inputType === "textarea" ? (
                                <textarea
                                    id={attribute.name}
                                    name={attribute.name}
                                    defaultValue={valueOrValues as string}
                                    rows={4}
                                    style={{
                                        width: "100%",
                                        padding: "10px 12px",
                                        background: "var(--fd-bg-elevated)",
                                        color: "var(--fd-text-primary)",
                                        border: `1px solid ${hasError ? "var(--fd-error)" : "var(--fd-border-default)"}`,
                                        fontSize: "0.875rem",
                                        resize: "vertical",
                                        fontFamily: "inherit",
                                    }}
                                    onChange={e =>
                                        dispatchFormAction({
                                            action: "update",
                                            name: attribute.name,
                                            valueOrValues: e.target.value,
                                        })
                                    }
                                />
                            ) : attribute.annotations?.inputType === "checkbox" ? (
                                <FdCheckbox
                                    id={attribute.name}
                                    name={attribute.name}
                                    defaultChecked={(valueOrValues as string) === "true"}
                                    onChange={e =>
                                        dispatchFormAction({
                                            action: "update",
                                            name: attribute.name,
                                            valueOrValues: e.target.checked ? "true" : "false",
                                        })
                                    }
                                />
                            ) : (
                                <FdInput
                                    id={attribute.name}
                                    name={attribute.name}
                                    defaultValue={valueOrValues as string}
                                    type={attribute.annotations?.inputType ?? "text"}
                                    autoComplete={attribute.autocomplete}
                                    hasError={hasError}
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
                                            fieldIndex: undefined,
                                        })
                                    }
                                />
                            )}
                        </FdFormField>
                    </Fragment>
                );
            })}
        </>
    );
}
