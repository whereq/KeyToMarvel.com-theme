import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import { VgButton, VgAlert } from "@keycloak-theme/shared/ui";

export default function DeleteAccountConfirm(
    props: PageProps<Extract<KcContext, { pageId: "delete-account-confirm.ftl" }>, I18n>,
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { url, triggered_from_aia } = kcContext;
    const { msg, msgStr } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msg("deleteAccountConfirm")}
        >
            <VgAlert type="error">
                {msg("irreversibleAction")}
            </VgAlert>

            <p style={{ color: "var(--vg-text-secondary)", fontSize: "0.9rem", margin: "16px 0 8px", lineHeight: 1.6 }}>
                {msg("deletingImplies")}
            </p>

            <ul style={{ color: "var(--vg-text-muted)", fontSize: "0.85rem", paddingLeft: "20px", marginBottom: "20px", lineHeight: 2 }}>
                <li>{msg("loggingOutImmediately")}</li>
                <li>{msg("errasingData")}</li>
            </ul>

            <p style={{ color: "var(--vg-text-secondary)", fontSize: "0.875rem", marginBottom: "20px" }}>
                {msg("finalDeletionConfirmation")}
            </p>

            <form action={url.loginAction} method="post" className="flex flex-col gap-3">
                <VgButton variant="danger" size="lg" fullWidth type="submit">
                    {msgStr("doConfirmDelete")}
                </VgButton>
                {triggered_from_aia && (
                    <VgButton variant="secondary" size="md" fullWidth type="submit" name="cancel-aia" value="true">
                        {msgStr("doCancel")}
                    </VgButton>
                )}
            </form>
        </Template>
    );
}
