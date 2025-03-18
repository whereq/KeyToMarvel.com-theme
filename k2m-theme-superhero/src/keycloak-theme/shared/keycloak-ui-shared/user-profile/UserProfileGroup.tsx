/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260007.0.5.
 * To relinquish ownership and restore this file to its original content, run the following command:
 * 
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/user-profile/UserProfileGroup.tsx" --revert
 */

import { UserProfileAttributeMetadata } from "@keycloak/keycloak-admin-client/lib/defs/userProfileMetadata";
import { TFunction } from "i18next";
import { get } from "lodash-es";
import { PropsWithChildren, ReactNode } from "react";
import { UseFormReturn, type FieldError } from "react-hook-form";

import { FormErrorText } from "../controls/FormErrorText";
import { HelpItem } from "../controls/HelpItem";
import {
  UserFormFields,
  fieldName,
  isRequiredAttribute,
  label,
  labelAttribute,
} from "./utils";

export type UserProfileGroupProps = {
  t: TFunction;
  form: UseFormReturn<UserFormFields>;
  attribute: UserProfileAttributeMetadata;
  renderer?: (attribute: UserProfileAttributeMetadata) => ReactNode;
  /** Additional classes for the form group */
  className?: string;
};

export const UserProfileGroup = ({
  t,
  form,
  attribute,
  renderer,
  children,
  className = "",
}: PropsWithChildren<UserProfileGroupProps>) => {
  const helpText = label(
    t,
    attribute.annotations?.["inputHelperTextBefore"] as string,
  );
  const {
    formState: { errors },
  } = form;

  const component = renderer?.(attribute);
  const error = get(errors, fieldName(attribute.name)) as FieldError;

  return (
    <div className={`mb-4 ${className}`}> {/* FormGroup replacement */}
      <div className="flex flex-col md:flex-row md:items-start gap-4"> {/* Responsive layout */}
        {/* Label */}
        <label
          htmlFor={attribute.name}
          className="block font-bold text-sm text-orange-400 md:w-1/12"
        >
          {labelAttribute(t, attribute) || ""}
          {isRequiredAttribute(attribute) && (
            <span className="text-red-500"> *</span>
          )}
        </label>

        {/* Input and Component */}
        <div className="flex-1"> {/* Takes remaining space */}
          {component ? (
            <div className="flex gap-2 bg-gray-100 border-none"> {/* InputGroup replacement with changes */}
              {children}
              {component}
            </div>
          ) : (
            <div className="bg-gray-100 border-none">{children}</div> // Applied to children when no component
          )}
          {error && (
            <FormErrorText
              data-testid={`${attribute.name}-helper`}
              message={error.message as string}
            />
          )}
        </div>

        {/* Help Text */}
        {helpText && (
          <div className="md:w-1/4"> {/* Fixed width for help text on larger screens */}
            <HelpItem helpText={helpText} fieldLabelId={attribute.name!} />
          </div>
        )}
      </div>
    </div>
  );
};