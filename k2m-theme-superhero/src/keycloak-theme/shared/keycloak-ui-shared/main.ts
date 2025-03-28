/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260007.0.5.
 * To relinquish ownership and restore this file to its original content, run the following command:
 * 
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/main.ts" --revert
 */

/* eslint-disable */

// @ts-nocheck

export {
  AlertProvider,
  useAlerts,
  type AddAlertFunction,
  type AddErrorFunction,
  type AlertProps,
} from "./alerts/Alerts";
export { ErrorPage } from "./context/ErrorPage";
export { Help, useHelp } from "./context/HelpContext";
export {
  KeycloakProvider,
  useEnvironment,
  type KeycloakContext,
} from "./context/KeycloakContext";
export {
  getInjectedEnvironment,
  type BaseEnvironment,
} from "./context/environment";
export { ContinueCancelModal } from "./continue-cancel/ContinueCancelModal";
export {
  FormErrorText,
  type FormErrorTextProps,
} from "./controls/FormErrorText";
export { HelpItem } from "./controls/HelpItem";
export { NumberControl } from "./controls/NumberControl";
export { PasswordControl } from "./controls/PasswordControl";
export { PasswordInput } from "./controls/PasswordInput";
export {
  SelectControl,
} from "./controls/select-control/SelectControl";
export {
  SelectVariant
} from "./controls/select-control/types";
export type {
  SelectControlOption,
  SelectControlProps,
} from "./controls/select-control/SelectControl";
export {
  SwitchControl,
  type SwitchControlProps,
} from "./controls/SwitchControl";
export { TextAreaControl } from "./controls/TextAreaControl";
export { TextControl } from "./controls/TextControl";
export {
  KeycloakTextArea,
  type KeycloakTextAreaProps,
} from "./controls/keycloak-text-area/KeycloakTextArea";
export { IconMapper } from "./icons/IconMapper";
export { FormPanel } from "./scroll-form/FormPanel";
export { ScrollForm, mainPageContentId } from "./scroll-form/ScrollForm";
export {
  FormSubmitButton,
  type FormSubmitButtonProps,
} from "./buttons/FormSubmitButton";
export { UserProfileFields } from "./user-profile/UserProfileFields";
export {
  beerify,
  debeerify,
  isUserProfileError,
  label,
  setUserProfileServerError,
} from "./user-profile/utils";
export type { UserFormFields } from "./user-profile/utils";
export { createNamedContext } from "./utils/createNamedContext";
export {
  getErrorDescription,
  getErrorMessage,
  getNetworkErrorMessage,
  getNetworkErrorDescription,
} from "./utils/errors";
export { isDefined } from "./utils/isDefined";
export { useRequiredContext } from "./utils/useRequiredContext";
export { useStoredState } from "./utils/useStoredState";
export { useSetTimeout } from "./utils/useSetTimeout";
export { generateId } from "./utils/generateId";
export { default as KeycloakMasthead } from "./masthead/Masthead";
export { KeycloakSelect } from "./select/KeycloakSelect";
export type { Variant, KeycloakSelectProps } from "./select/KeycloakSelect";
export { KeycloakDataTable } from "./controls/table/KeycloakDataTable";
export type {
  Action,
  Field,
  DetailField,
  LoaderFunction,
} from "./controls/table/KeycloakDataTable";
export { PaginatingTableToolbar } from "./controls/table/PaginatingTableToolbar";
export { TableToolbar } from "./controls/table/TableToolbar";
export { ListEmptyState } from "./controls/table/ListEmptyState";
export { KeycloakSpinner } from "./controls/KeycloakSpinner";
export { useFetch } from "./utils/useFetch";
export {
  useErrorBoundary,
  ErrorBoundaryFallback,
  ErrorBoundaryProvider,
} from "./utils/ErrorBoundary";
export type { FallbackProps } from "./utils/ErrorBoundary";
export { OrganizationTable } from "./controls/OrganizationTable";
export { initializeDarkMode } from "./utils/darkMode";
