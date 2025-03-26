import type { KcClsx } from "keycloakify/login/lib/kcClsx";
import type { KcContext } from "@/keycloak-theme/layout/KcContext";
import type { I18n } from "@/keycloak-theme/layout/i18n";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { useState } from "react";
import { TermsText } from "@keycloak-theme/login/pages/terms/TermsText";

export default function TermsAcceptance(props: {
    i18n: I18n;
    kcClsx: KcClsx;
    messagesPerField: Pick<KcContext["messagesPerField"], "existsError" | "get">;
    areTermsAccepted: boolean;
    onAreTermsAcceptedValueChange: (areTermsAccepted: boolean) => void;
}) {
    const { i18n, messagesPerField, areTermsAccepted, onAreTermsAcceptedValueChange } = props;
    const { msg, msgStr } = i18n;
    const [isTermsExpanded, setIsTermsExpanded] = useState(false);

    const toggleTerms = () => {
        setIsTermsExpanded(!isTermsExpanded);
    };

    return (
        <>
            <div className="form-group">
                <TermsText 
                    title={msgStr("termsTitle")} 
                    isExpanded={isTermsExpanded} 
                    onToggle={toggleTerms} 
                />
            </div>
            <div className="form-group">
                <div className="bg-orange-400 p-2 rounded-sm">
                    <div className="flex items-start">
                        <input
                            type="checkbox"
                            id="termsAccepted"
                            name="termsAccepted"
                            className="h-4 w-4 mt-1 rounded-sm border-gray-300 text-gray-100 focus:ring-orange-500"
                            checked={areTermsAccepted}
                            onChange={e => onAreTermsAcceptedValueChange(e.target.checked)}
                            aria-invalid={messagesPerField.existsError("termsAccepted")}
                        />
                        <label htmlFor="termsAccepted" className="ml-2 block text-gray-100">
                            {msg("acceptTerms")}
                        </label>
                    </div>
                    {messagesPerField.existsError("termsAccepted") && (
                        <div className="mt-2">
                            <span
                                id="input-error-terms-accepted"
                                className="text-sm text-red-600"
                                aria-live="polite"
                                dangerouslySetInnerHTML={{
                                    __html: kcSanitize(messagesPerField.get("termsAccepted"))
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}