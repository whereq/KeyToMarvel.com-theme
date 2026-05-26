import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import { CbButton } from "@keycloak-theme/shared/ui";
import { FiAlertTriangle, FiArrowLeft, FiLogIn, FiMail } from "react-icons/fi";

const SUPPORT_EMAIL = "admin@catobigato.com";

function getHint(summary: string): string | null {
    const s = summary.toLowerCase();
    if (s.includes("registration not allowed") || s.includes("registrations not allowed")) {
        return "New accounts are currently by invitation only. If you believe you should have access, please contact the administrator.";
    }
    if (s.includes("expired") || s.includes("session")) {
        return "Your session timed out. Please start again from the application.";
    }
    if (s.includes("invalid") && s.includes("token")) {
        return "The link you followed is no longer valid. Please return to the application and try again.";
    }
    if (s.includes("access denied") || s.includes("not allowed")) {
        return "You do not have permission to perform this action. Contact the administrator if you think this is a mistake.";
    }
    return null;
}

export default function Error(
    props: PageProps<Extract<KcContext, { pageId: "error.ftl" }>, I18n>,
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { message, client, skipLink } = kcContext;
    const { msg } = i18n;

    const hint = message ? getHint(message.summary) : null;

    const redirectUri = typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("redirect_uri")
        : null;
    const backUrl = client?.baseUrl || redirectUri || null;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={false}
            headerNode={null}
        >
            <div className="flex flex-col items-center gap-6 py-2">
                <div
                    className="flex items-center justify-center w-16 h-16 rounded-full"
                    style={{
                        background: "var(--cb-error-bg)",
                        border: "2px solid var(--cb-error)",
                    }}
                >
                    <FiAlertTriangle size={28} style={{ color: "var(--cb-error)" }} />
                </div>

                <div className="text-center flex flex-col gap-2">
                    <h1
                        className="text-lg font-bold"
                        style={{ color: "var(--cb-text-primary)" }}
                    >
                        {msg("errorTitle")}
                    </h1>

                    {message && (
                        <p
                            className="text-sm font-medium"
                            style={{ color: "var(--cb-error)" }}
                            dangerouslySetInnerHTML={{ __html: kcSanitize(message.summary) }}
                        />
                    )}
                </div>

                {hint && (
                    <p
                        className="text-sm text-center leading-relaxed max-w-sm"
                        style={{ color: "var(--cb-text-secondary)" }}
                    >
                        {hint}
                    </p>
                )}

                <div
                    className="w-full"
                    style={{ height: "1px", background: "var(--cb-border-default)" }}
                />

                <div className="flex flex-col gap-3 w-full">
                    {!skipLink && backUrl && (
                        <CbButton
                            variant="primary"
                            size="md"
                            fullWidth
                            leftIcon={<FiArrowLeft size={14} />}
                            onClick={() => { window.location.href = backUrl; }}
                        >
                            {msg("backToApplication")}
                        </CbButton>
                    )}

                    {backUrl && (
                        <CbButton
                            variant="secondary"
                            size="md"
                            fullWidth
                            leftIcon={<FiLogIn size={14} />}
                            onClick={() => { window.location.href = backUrl; }}
                        >
                            {msg("doLogIn")}
                        </CbButton>
                    )}

                    <CbButton
                        variant="ghost"
                        size="md"
                        fullWidth
                        leftIcon={<FiMail size={14} />}
                        onClick={() => { window.location.href = `mailto:${SUPPORT_EMAIL}`; }}
                    >
                        Contact Support
                    </CbButton>
                </div>

                <p className="text-xs text-center" style={{ color: "var(--cb-text-muted)" }}>
                    Need help?{" "}
                    <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color: "var(--cb-purple-500)" }}>
                        {SUPPORT_EMAIL}
                    </a>
                </p>
            </div>
        </Template>
    );
}
