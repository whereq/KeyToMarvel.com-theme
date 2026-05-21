import { useEffect, Fragment } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import { CqInput, CqPasswordInput, CqFormField, CqCheckbox } from "@keycloak-theme/shared/ui";
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
                        <CqFormField
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
                                <CqPasswordInput
                                    id={attribute.name}
                                    name={attribute.name}
                                    autoComplete="new-password"
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
                                        background: "var(--cq-surface-2)",
                                        color: "var(--cq-text)",
                                        border: `1px solid ${hasError ? "var(--cq-error)" : "var(--cq-border)"}`,
                                        borderRadius: "var(--cq-r-sm)",
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
                                        background: "var(--cq-surface-2)",
                                        color: "var(--cq-text)",
                                        border: `1px solid ${hasError ? "var(--cq-error)" : "var(--cq-border)"}`,
                                        borderRadius: "var(--cq-r-sm)",
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
                                <CqCheckbox
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
                                <CqInput
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
                        </CqFormField>
                    </Fragment>
                );
            })}
        </>
    );
}
