/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260007.0.5.
 * To relinquish ownership and restore this file to its original content, run the following command:
 * 
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/user-profile/UserProfileFields.tsx" --revert
 */

import { useMemo } from "react";
import { ScrollForm } from "@keycloak-theme/shared/keycloak-ui-shared/scroll-form/ScrollForm";
import { FormField } from "@keycloak-theme/shared/keycloak-ui-shared/user-profile/user-profile-fields/FormField";
import { UserProfileFieldsProps, GroupWithAttributes } from "@keycloak-theme/shared/keycloak-ui-shared/user-profile/user-profile-fields/Types";
import { label } from "@keycloak-theme/shared/keycloak-ui-shared/user-profile/utils";

export const UserProfileFields = ({
  t,
  form,
  userProfileMetadata,
  supportedLocales,
  currentLocale,
  hideReadOnly = false,
  renderer,
}: UserProfileFieldsProps) => {
  // Group attributes by group, for easier rendering.
  const groupsWithAttributes = useMemo(() => {
    // If there are no attributes, there is no need to group them.
    if (!userProfileMetadata.attributes) {
      return [];
    }

    // Hide read-only attributes if 'hideReadOnly' is enabled.
    const attributes = hideReadOnly
      ? userProfileMetadata.attributes.filter(({ readOnly }) => !readOnly)
      : userProfileMetadata.attributes;

    return [
      // Insert an empty group for attributes without a group.
      { name: undefined },
      ...(userProfileMetadata.groups ?? []),
    ].map<GroupWithAttributes>((group) => ({
      group,
      attributes: attributes.filter(
        (attribute) => attribute.group === group.name,
      ),
    }));
  }, [
    hideReadOnly,
    userProfileMetadata.groups,
    userProfileMetadata.attributes,
  ]);

  if (groupsWithAttributes.length === 0) {
    return null;
  }

  return (
    <ScrollForm
      label={t("jumpToSection")}
      sections={groupsWithAttributes
        .filter((group) => group.attributes.length > 0)
        .map(({ group, attributes }) => ({
          title: label(t, group.displayHeader, group.name) || t("general"),
          panel: (
            <div className="space-y-4">
              {group.displayDescription && (
                <p className="pb-6 text-gray-700">
                  {label(t, group.displayDescription, "")}
                </p>
              )}
              {attributes.map((attribute) => (
                <FormField
                  key={attribute.name}
                  t={t}
                  form={form}
                  supportedLocales={supportedLocales}
                  currentLocale={currentLocale}
                  renderer={renderer}
                  attribute={attribute}
                />
              ))}
            </div>
          ),
        }))}
    />
  );
};