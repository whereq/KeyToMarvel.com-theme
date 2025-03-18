/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260007.0.5.
 * To relinquish ownership and restore this file to its original content, run the following command:
 * 
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/user-profile/TextComponent.tsx" --revert
 */

import { UserProfileFieldProps } from "@keycloak-theme/shared/keycloak-ui-shared/user-profile/user-profile-fields/Types";
import { UserProfileGroup } from "./UserProfileGroup";
import { fieldName, isRequiredAttribute, label } from "./utils";

export const TextComponent = (props: UserProfileFieldProps) => {
  const { form, inputType, attribute, t } = props;
  const isRequired = isRequiredAttribute(attribute);

  // Determine the input type (e.g., "text", "email", "tel", etc.)
  const type = inputType.startsWith("html")
    ? inputType.substring("html".length + 2)
    : "text";

  return (
    <UserProfileGroup {...props}>
      <input
        id={attribute.name}
        data-testid={attribute.name}
        type={type}
        placeholder={label(
          t,
          attribute.annotations?.["inputTypePlaceholder"] as string,
          attribute.name,
          attribute.annotations?.["inputOptionLabelsI18nPrefix"] as string,
        )}
        readOnly={attribute.readOnly}
        required={isRequired}
        {...form.register(fieldName(attribute.name))}
        className="w-full bg-gray-700 text-orange-300 p-2 
                  focus:outline-none focus:ring-2 focus:ring-orange-400" // Tailwind CSS classes
      />
    </UserProfileGroup>
  );
};