import { JSX } from "react";
import { useIsPasswordRevealed } from "keycloakify/tools/useIsPasswordRevealed";
import type { KcClsx } from "keycloakify/login/lib/kcClsx";
import type { I18n } from "@keycloak-theme/login/i18n";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function PasswordWrapper(props: { 
    kcClsx: KcClsx; 
    i18n: I18n; 
    passwordInputId: string; 
    children: JSX.Element 
}) {
    const { i18n, passwordInputId, children } = props;
    const { msgStr } = i18n;
    const { isPasswordRevealed, toggleIsPasswordRevealed } = useIsPasswordRevealed({ passwordInputId });

    return (
        <div className="relative">
            {children}
            <button
                type="button"
                className="absolute right-0 top-0 h-full flex items-center justify-center px-3 text-orange-400 hover:text-orange-300"
                aria-label={msgStr(isPasswordRevealed ? "hidePassword" : "showPassword")}
                aria-controls={passwordInputId}
                onClick={toggleIsPasswordRevealed}
            >
                {isPasswordRevealed ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
            </button>
        </div>
    );
}