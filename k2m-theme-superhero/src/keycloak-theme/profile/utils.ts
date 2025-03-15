import type { I18n } from "@keycloak-theme/login/i18n";
import type { Attribute } from "keycloakify/login/KcContext";

export function inputLabel(i18n: I18n, attribute: Attribute, option: string) {
    const { advancedMsg } = i18n;
    if (attribute.annotations.inputOptionLabels !== undefined) {
        const { inputOptionLabels } = attribute.annotations;
        return advancedMsg(inputOptionLabels[option] ?? option);
    }
    if (attribute.annotations.inputOptionLabelsI18nPrefix !== undefined) {
        return advancedMsg(`${attribute.annotations.inputOptionLabelsI18nPrefix}.${option}`);
    }
    return option;
}