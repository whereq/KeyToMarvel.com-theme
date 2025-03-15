import { JSX } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import type { I18n } from "@keycloak-theme/login/i18n";
import { usePasswordVisibility } from "@keycloak-theme/hooks/k2mHooks";
import React from "react";

export default function PasswordWrapper({
    i18n,
    passwordInputId,
    children,
}: {
    i18n: I18n;
    passwordInputId: string;
    children: JSX.Element;
}) {
    const { msgStr } = i18n;
    const { isPasswordRevealed, togglePasswordVisibility } = usePasswordVisibility();

    // Clone the child input and dynamically set its type based on visibility state
    const modifiedChild = React.cloneElement(children, {
        type: isPasswordRevealed ? "text" : "password",
    });

    return (
        <div className="relative">
            {modifiedChild}
            <button
                type="button"
                className="absolute right-0 top-0 h-full flex items-center justify-center px-3 text-orange-400 hover:text-orange-300"
                aria-label={msgStr(isPasswordRevealed ? "hidePassword" : "showPassword")}
                aria-controls={passwordInputId}
                onClick={togglePasswordVisibility}
            >
                {isPasswordRevealed ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
            </button>
        </div>
    );
}