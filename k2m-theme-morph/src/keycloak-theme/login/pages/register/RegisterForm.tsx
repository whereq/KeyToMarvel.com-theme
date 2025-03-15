import { useState, forwardRef, useImperativeHandle, useEffect} from "react";
import type { KcContext } from "@keycloak-theme/login/KcContext";
import type { I18n } from "@keycloak-theme/login/i18n";
import PasswordWrapper from "@keycloak-theme/login/pages/login/PasswordWrapper";
import { MdErrorOutline } from "react-icons/md";
import { kcSanitize } from "keycloakify/lib/kcSanitize";

type RegisterFormProps = {
    kcContext: Extract<KcContext, { pageId: "register.ftl" }>;
    i18n: I18n;
    doMakeUserConfirmPassword: boolean;
};

// Define valid translation keys for form fields
type ValidTranslationKeys = "username" | "email" | "firstName" | "lastName" | "requiredFields";

export default forwardRef(function RegisterForm(props: RegisterFormProps, ref) {
    const { kcContext, i18n, doMakeUserConfirmPassword } = props;
    const { message, profile, messagesPerField } = kcContext;
    const { msgStr } = i18n;

    // Extract form data and attributes from the profile
    const { attributesByName } = profile;

    // State for form fields and errors
    const [formValues, setFormValues] = useState<Record<string, string>>({});
    const [formErrors, setFormErrors] = useState<Record<string, string | null>>({});

    const fieldNameToTranslationKey: Record<string, ValidTranslationKeys> = {
        username: "username",
        email: "email",
        firstName: "firstName",
        lastName: "lastName",
        requiredFields: "requiredFields",
        // Add more mappings as needed
    };

    // Log messagesPerField in RegisterForm
    useEffect(() => {
        console.log("In RegisterForm");
        console.log("Messages returned from the backend:", messagesPerField);
        console.log("Email error exists:", messagesPerField.existsError("email"));
        console.log("Email error message:", messagesPerField.get("email"));
        console.log("Exists email:", messagesPerField.existsError("email"))
        console.log(kcSanitize(messagesPerField.get("email")));
        console.log("Messages", message);
        console.log("Profile", profile);
    }, [messagesPerField, message, profile]);

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
        <div className="space-y-4 bg-gray-800 p-4 rounded-sm">
            {Object.keys(attributesByName).map((fieldName) => {
                const field = attributesByName[fieldName];
                const error = getFieldError(fieldName);

                if (field.required) {
                    return (
                        <div key={fieldName} className="relative">
                            <input
                                type={fieldName === "email" ? "email" : "text"}
                                id={fieldName}
                                name={fieldName}
                                className="w-full px-3 py-2 bg-gray-700 text-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder={msgStr(fieldNameToTranslationKey[fieldName])}
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

            {/* Password */}
            <div className="relative">
                <PasswordWrapper i18n={i18n} passwordInputId="password">
                    <input
                        id="password"
                        name="password"
                        className="w-full px-3 py-2 bg-gray-700 text-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={msgStr("password")}
                        value={formValues["password"] || ""}
                        onChange={handleInputChange("password")}
                        required
                    />
                </PasswordWrapper>
                {formErrors["password"] && (
                    <>
                        <span className="text-red-400 text-sm mt-1">{formErrors["password"]}</span>
                        <MdErrorOutline className="absolute right-3 top-3 text-red-400" />
                    </>
                )}
            </div>

            {/* Confirm Password */}
            {doMakeUserConfirmPassword && (
                <div className="relative">
                    <PasswordWrapper i18n={i18n} passwordInputId="password-confirm">
                        <input
                            id="password-confirm"
                            name="password-confirm"
                            className="w-full px-3 py-2 bg-gray-700 text-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={msgStr("passwordConfirm")}
                            value={formValues["password-confirm"] || ""}
                            onChange={handleInputChange("password-confirm")}
                            required
                        />
                    </PasswordWrapper>
                    {formErrors["password-confirm"] && (
                        <>
                            <span className="text-red-400 text-sm mt-1">{formErrors["password-confirm"]}</span>
                            <MdErrorOutline className="absolute right-3 top-3 text-red-400" />
                        </>
                    )}
                </div>
            )}
        </div>
    );
});