// i18nBuilder lives in login/i18n.ts so Keycloakify's build scanner can find it
// (the scanner only looks inside src/keycloak-theme/login/ for the i18nBuilder call).
// All components that import from layout/i18n keep working via this re-export.
export { useI18n, type I18n } from "@keycloak-theme/login/i18n";
