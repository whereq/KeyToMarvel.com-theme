import { useState } from "react";
import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import { CbCheckbox } from "@keycloak-theme/shared/ui";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import TermsText from "../terms/TermsText";

export default function TermsAcceptance(props: {
    kcContext: Extract<KcContext, { pageId: "register.ftl" }>;
    i18n: I18n;
    areTermsAccepted: boolean;
    setAreTermsAccepted: (v: boolean) => void;
}) {
    const { i18n, areTermsAccepted, setAreTermsAccepted } = props;
    const { msg } = i18n;
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="flex flex-col gap-3">
            <div
                style={{
                    border: "1px solid var(--cb-border-default)",
                    borderRadius: "var(--cb-radius-sm)",
                    overflow: "hidden",
                }}
            >
                <button
                    type="button"
                    onClick={() => setExpanded(v => !v)}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-left"
                    style={{
                        background: "var(--cb-bg-elevated)",
                        color: "var(--cb-text-secondary)",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        border: "none",
                    }}
                >
                    <span>{msg("termsTitle")}</span>
                    {expanded ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
                </button>

                {expanded && (
                    <div
                        style={{
                            maxHeight: "200px",
                            overflowY: "auto",
                            padding: "16px",
                            background: "var(--cb-bg-card)",
                            borderTop: "1px solid var(--cb-border-subtle)",
                        }}
                    >
                        <TermsText />
                    </div>
                )}
            </div>

            <CbCheckbox
                id="termsAccepted"
                name="termsAccepted"
                checked={areTermsAccepted}
                onChange={e => setAreTermsAccepted(e.target.checked)}
                label={msg("acceptTerms")}
            />
        </div>
    );
}
