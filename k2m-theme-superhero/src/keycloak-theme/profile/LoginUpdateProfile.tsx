import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import { MdErrorOutline } from "react-icons/md";
import { kcSanitize } from "keycloakify/lib/kcSanitize";

type LoginUpdateProfileProps = PageProps<Extract<KcContext, { pageId: "login-update-profile.ftl" }>, I18n>;

// Define valid translation keys for form fields
type ValidTranslationKeys = "username" | "email" | "firstName" | "lastName" | "requiredFields";

export default forwardRef(function LoginUpdateProfile(props: LoginUpdateProfileProps, ref) {
    const { kcContext, i18n, doUseDefaultCss, Template} = props;
    const { messagesPerField, url, isAppInitiatedAction, profile } = kcContext;
    const { msg, msgStr } = i18n;

    // Extract form data and attributes from the profile
    const { attributesByName } = profile;

    // State for form fields and errors
    const [formValues, setFormValues] = useState<Record<string, string>>({});
    const [formErrors, setFormErrors] = useState<Record<string, string | null>>({});
    const [isFormSubmittable, setIsFormSubmittable] = useState(false);


    const fieldNameToTranslationKey: Record<string, ValidTranslationKeys> = {
        username: "username",
        email: "email",
        firstName: "firstName",
        lastName: "lastName",
        requiredFields: "requiredFields",
        // Add more mappings as needed
    };

    // Initialize form values from profile.attributesByName.values
    useEffect(() => {
        const initialValues: Record<string, string> = {};
        Object.keys(attributesByName).forEach((fieldName) => {
            initialValues[fieldName] = attributesByName[fieldName]?.values?.[0] || "";
        });
        setFormValues(initialValues);
    }, [attributesByName]);

    // Validate a field based on its validators
    const validateField = (fieldName: string, value: string): boolean => {
        const validators = attributesByName[fieldName]?.validators || {};
        let isValid = true;

        // Check for required fields
        if (attributesByName[fieldName]?.required && !value.trim()) {
            setFormErrors((prev) => ({ ...prev, [fieldName]: msgStr("error-user-attribute-required") }));
            isValid = false;
        }

        // Check for length validators
        if (validators.length) {
            const { min, max } = validators.length;
            if (min && value.length < Number(min)) {
                setFormErrors((prev) => ({ ...prev, [fieldName]: msgStr("invalidPasswordMinLengthMessage", String(min)) }));
                isValid = false;
            }
            if (max && value.length > Number(max)) {
                setFormErrors((prev) => ({ ...prev, [fieldName]: msgStr("invalidPasswordMaxLengthMessage", String(max)) }));
                isValid = false;
            }
        }

        // Check for email format
        if (fieldName === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            setFormErrors((prev) => ({ ...prev, [fieldName]: msgStr("shouldMatchPattern") }));
            isValid = false;
        }

        // Clear error if the field is valid
        if (isValid) {
            setFormErrors((prev) => ({ ...prev, [fieldName]: null }));
        }

        return isValid;
    };

    // Validate the entire form
    const validateForm = () => {
        let isFormValid = true;
        Object.keys(attributesByName).forEach((fieldName) => {
            if (fieldName !== "password" && fieldName !== "password-confirm") {
                const isValid = validateField(fieldName, formValues[fieldName]);
                if (!isValid) isFormValid = false;
            }
        });
        setIsFormSubmittable(isFormValid);
        return isFormValid;
    };

    // Handle input changes
    const handleInputChange = (fieldName: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFormValues((prev) => ({ ...prev, [fieldName]: value }));
        validateField(fieldName, value); // Validate on change
    };

    // Expose validateForm to parent component
    useImperativeHandle(ref, () => ({
        validateForm,
    }));

    // Combine client-side and server-side errors for display
    const getFieldError = (fieldName: string) => {
        if (messagesPerField.existsError(fieldName)) {
            return kcSanitize(messagesPerField.get(fieldName)); // Use server-side error if present
        }
        return formErrors[fieldName];
    };

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            displayRequiredFields
            headerNode={msg("loginProfileTitle")}
            displayMessage={messagesPerField.exists("global")}
        >
            <form id="kc-update-profile-form" action={url.loginAction} method="post" 
                className="space-y-4">
                <div className="space-y-4 bg-gray-800 p-4 rounded-sm">
                    {/* Render required fields */}
                    {Object.keys(attributesByName).map((fieldName) => {
                        const field = attributesByName[fieldName];
                        const error = getFieldError(fieldName);

                        console.log("field: ", field);
                        console.log(fieldNameToTranslationKey[fieldName]);

                        if (field.required) {
                            return (
                                <div key={fieldName} className="relative">
                                    <input
                                        type={fieldName === "email" ? "email" : "text"}
                                        id={fieldName}
                                        name={fieldName}
                                        className="w-full px-3 py-2 bg-gray-700 text-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        // placeholder={msgStr(fieldNameToTranslationKey[fieldName])}
                                        placeholder={fieldName}
                                        value={formValues[fieldName] || ""}
                                        onChange={handleInputChange(fieldName)}
                                        required={field.required}
                                    />
                                    {error && (
                                        <>
                                            <span className="text-red-400 text-sm mt-1">{error}</span>
                                            <MdErrorOutline className="absolute right-3 top-3 text-red-400" />
                                        </>
                                    )}
                                </div>
                            );
                        }
                    })}
                </div>

                {/* Form buttons */}
                <div className="flex flex-col space-y-2">
                    <input
                        disabled={!isFormSubmittable}
                        className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="submit"
                        value={msgStr("doSubmit")}
                    />
                    {isAppInitiatedAction && (
                        <button
                            className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            type="submit"
                            name="cancel-aia"
                            value="true"
                            formNoValidate
                        >
                            {msg("doCancel")}
                        </button>
                    )}
                </div>
            </form>
        </Template>
    );
});