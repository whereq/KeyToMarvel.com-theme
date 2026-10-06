import { useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import { QhButton, QhCheckbox } from "@keycloak-theme/shared/ui";

export default function DeleteAccountConfirm(
    props: PageProps<Extract<KcContext, { pageId: "delete-account-confirm.ftl" }>, I18n>,
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { url, triggered_from_aia } = kcContext;
    const { msg, msgStr } = i18n;

    const [confirmed, setConfirmed] = useState(false);

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msg("deleteAccountConfirm")}
        >
            <div
                style={{
                    padding: "12px 16px",
                    background: "var(--qh-error-bg)",
                    borderLeft: "2px solid var(--qh-error)",
                    marginBottom: "20px",
                    fontSize: "0.875rem",
                    color: "var(--qh-text-2)",
                    lineHeight: 1.6,
                    borderRadius: "var(--qh-r-xs)",
                }}
            >
                {msg("irreversibleAction")}
            </div>

            <form action={url.loginAction} method="post" className="flex flex-col gap-4">
                <QhCheckbox
                    id="confirmDeletion"
                    label={msg("deleteAccountConfirm")}
                    onChange={e => setConfirmed(e.target.checked)}
                />
                <div className="flex gap-3">
                    <QhButton
                        variant="danger"
                        size="lg"
                        style={{ flex: 1 }}
                        disabled={!confirmed}
                        name="accept"
                        value="true"
                        type="submit"
                    >
                        {msgStr("doConfirmDelete")}
                    </QhButton>
                    {triggered_from_aia && (
                        <QhButton
                            variant="secondary"
                            size="lg"
                            style={{ flex: 1 }}
                            name="cancel-aia"
                            value="true"
                            type="submit"
                        >
                            {msgStr("doCancel")}
                        </QhButton>
                    )}
                </div>
            </form>
        </Template>
    );
}
