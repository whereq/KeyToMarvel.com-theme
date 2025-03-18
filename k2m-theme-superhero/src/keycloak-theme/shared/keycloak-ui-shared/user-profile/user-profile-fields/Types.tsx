import {
  UserProfileAttributeGroupMetadata,
  UserProfileAttributeMetadata,
  UserProfileMetadata,
} from "@keycloak/keycloak-admin-client/lib/defs/userProfileMetadata";
import { TFunction } from "i18next";
import { ReactNode, JSX } from "react";
import { UseFormReturn } from "react-hook-form";
import { UserFormFields } from "../utils";

export type UserProfileError = {
  responseData: { errors?: { errorMessage: string }[] };
};

export type Options = {
  options?: string[];
};

export type InputType =
  | "text"
  | "textarea"
  | "select"
  | "select-radiobuttons"
  | "multiselect"
  | "multiselect-checkboxes"
  | "html5-email"
  | "html5-tel"
  | "html5-url"
  | "html5-number"
  | "html5-range"
  | "html5-datetime-local"
  | "html5-date"
  | "html5-month"
  | "html5-time"
  | "multi-input";

export type UserProfileFieldProps = {
  t: TFunction;
  form: UseFormReturn<UserFormFields>;
  inputType: InputType;
  attribute: UserProfileAttributeMetadata;
  renderer?: (attribute: UserProfileAttributeMetadata) => ReactNode;
};

export type OptionLabel = Record<string, string> | undefined;

export type UserProfileFieldsProps = {
  t: TFunction;
  form: UseFormReturn<UserFormFields>;
  userProfileMetadata: UserProfileMetadata;
  supportedLocales: string[];
  currentLocale: string;
  hideReadOnly?: boolean;
  renderer?: (
    attribute: UserProfileAttributeMetadata,
  ) => JSX.Element | undefined;
};

export type GroupWithAttributes = {
  group: UserProfileAttributeGroupMetadata;
  attributes: UserProfileAttributeMetadata[];
};

export type FormFieldProps = {
  t: TFunction;
  form: UseFormReturn<UserFormFields>;
  supportedLocales: string[];
  currentLocale: string;
  attribute: UserProfileAttributeMetadata;
  renderer?: (
    attribute: UserProfileAttributeMetadata,
  ) => JSX.Element | undefined;
};
