import { type RefObject } from "react";
import type { Attribute } from "keycloakify/login/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";

export default function GroupLabel(props: {
    attribute: Attribute;
    groupNameRef: RefObject<string>;
    i18n: I18n;
}) {
    const { attribute, groupNameRef, i18n } = props;
    const { advancedMsg } = i18n;

    if (attribute.group?.name === groupNameRef.current) return null;

    groupNameRef.current = attribute.group?.name ?? "";

    if (!attribute.group) return null;

    return (
        <div
            style={{
                marginTop: 8,
                marginBottom: 4,
                paddingBottom: 8,
                borderBottom: "1px solid var(--cb-border-subtle)",
            }}
            {...Object.fromEntries(
                Object.entries(attribute.group.html5DataAnnotations ?? {}).map(([k, v]) => [
                    `data-${k}`,
                    v,
                ]),
            )}
        >
            {attribute.group.displayHeader && (
                <p
                    style={{
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        color: "var(--cb-orange-500)",
                        margin: 0,
                    }}
                >
                    {advancedMsg(attribute.group.displayHeader)}
                </p>
            )}
            {attribute.group.displayDescription && (
                <p
                    style={{
                        fontSize: "0.75rem",
                        color: "var(--cb-text-muted)",
                        margin: "4px 0 0",
                    }}
                >
                    {advancedMsg(attribute.group.displayDescription)}
                </p>
            )}
        </div>
    );
}
