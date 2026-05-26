import type { I18n } from "@keycloak-theme/layout/i18n";
import type { Attribute } from "keycloakify/login/KcContext";

/**
 * Resolves the display label for a select/multiselect option.
 *
 * Priority:
 * 1. `inputOptionLabels[option]` annotation
 * 2. `inputOptionLabelsI18nPrefix.{option}` i18n key
 * 3. Raw option value
 */
export function inputLabel(i18n: I18n, attribute: Attribute, option: string): string {
    const { advancedMsgStr } = i18n;

    const labelFromAnnotation = attribute.annotations.inputOptionLabels?.[option];
    if (labelFromAnnotation !== undefined) {
        return advancedMsgStr(labelFromAnnotation);
    }

    const prefix = attribute.annotations.inputOptionLabelsI18nPrefix;
    if (prefix !== undefined) {
        return advancedMsgStr(`${prefix}.${option}`);
    }

    return option;
}
