import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import { FdButton } from "@keycloak-theme/shared/ui";

export default function LogoutConfirm(
    props: PageProps<Extract<KcContext, { pageId: "logout-confirm.ftl" }>, I18n>,
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { url, client, logoutConfirm } = kcContext;
    const { msg, msgStr } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msg("logoutConfirmTitle")}
        >
            <p style={{ color: "var(--fd-text-secondary)", fontSize: "0.9rem", marginBottom: "20px", lineHeight: 1.6 }}>
                {msg("logoutConfirmHeader")}
            </p>

            <form id="kc-logout-confirm" action={url.logoutConfirmAction} method="POST" className="flex flex-col gap-3">
                <input type="hidden" name="session_code" value={logoutConfirm.code} />
                <FdButton variant="danger" size="lg" fullWidth type="submit" id="kc-logout" name="confirmLogout" value="true">
                    {msgStr("doLogout")}
                </FdButton>
            </form>

            {!logoutConfirm.skipLink && client.baseUrl && (
                <div className="mt-4 text-center">
                    <a href={client.baseUrl} style={{ fontSize: "0.8rem", color: "var(--fd-text-muted)" }}>
                        {msg("backToApplication")}
                    </a>
                </div>
            )}
        </Template>
    );
}
