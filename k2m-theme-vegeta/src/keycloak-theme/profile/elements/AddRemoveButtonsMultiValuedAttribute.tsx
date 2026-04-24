import { getButtonToDisplayForMultivaluedAttributeField } from "keycloakify/login/lib/useUserProfileForm";
import type { Attribute } from "keycloakify/login/KcContext";
import type { FormAction } from "keycloakify/login/lib/useUserProfileForm";
import type { I18n } from "@keycloak-theme/layout/i18n";

export default function AddRemoveButtonsMultiValuedAttribute(props: {
    attribute: Attribute;
    values: string[];
    fieldIndex: number;
    dispatchFormAction: (action: FormAction) => void;
    i18n: I18n;
}) {
    const { attribute, values, fieldIndex, dispatchFormAction, i18n } = props;
    const { msg } = i18n;

    const { hasAdd, hasRemove } = getButtonToDisplayForMultivaluedAttributeField({
        attribute,
        values,
        fieldIndex,
    });

    if (!hasAdd && !hasRemove) return null;

    return (
        <div style={{ display: "inline-flex", gap: 8, marginLeft: 8 }}>
            {hasRemove && (
                <button
                    type="button"
                    onClick={() =>
                        dispatchFormAction({
                            action: "update",
                            name: attribute.name,
                            valueOrValues: values.filter((_, i) => i !== fieldIndex),
                        })
                    }
                    style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "0.75rem",
                        color: "var(--vg-error)",
                        padding: "2px 4px",
                    }}
                >
                    {msg("remove")}
                </button>
            )}
            {hasAdd && (
                <button
                    type="button"
                    onClick={() =>
                        dispatchFormAction({
                            action: "update",
                            name: attribute.name,
                            valueOrValues: [...values, ""],
                        })
                    }
                    style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "0.75rem",
                        color: "var(--vg-cyan-400)",
                        padding: "2px 4px",
                    }}
                >
                    {msg("addValue")}
                </button>
            )}
        </div>
    );
}
