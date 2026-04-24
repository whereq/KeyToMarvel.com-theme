/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { ExtendKcContext } from "keycloakify/login";
import type { KcEnvName, ThemeName } from "@keycloak-theme/kc.gen";

export type KcContextExtension = {
    themeName: ThemeName;
    properties: Record<KcEnvName, string> & {};
    // Extend here if additional KC context properties are needed.
    // See: https://docs.keycloakify.dev/faq-and-help/some-values-you-need-are-missing-from-in-kccontext
};

export type KcContextExtensionPerPage = {};

export type KcContext = ExtendKcContext<KcContextExtension, KcContextExtensionPerPage>;
