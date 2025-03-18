/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260007.0.5.
 * To relinquish ownership and restore this file to its original content, run the following command:
 * 
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/controls/select-control/SelectControl.tsx" --revert
 */

import { FieldPath, FieldValues } from "react-hook-form";
import { SingleSelectControl } from "./SingleSelectControl";
import { TypeaheadSelectControl } from "./TypeaheadSelectControl";

import { SelectVariant, SelectControlProps } from "./types";

export const SelectControl = <
  T extends FieldValues,
  P extends FieldPath<T> = FieldPath<T>,
>({
  variant = SelectVariant.single,
  ...rest
}: SelectControlProps<T, P>) =>
  variant === SelectVariant.single ? (
    <SingleSelectControl {...rest} />
  ) : (
    <TypeaheadSelectControl {...rest} variant={variant} />
  );