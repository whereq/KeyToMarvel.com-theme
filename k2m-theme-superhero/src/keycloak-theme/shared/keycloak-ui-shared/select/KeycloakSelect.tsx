/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260007.0.5.
 * To relinquish ownership and restore this file to its original content, run the following command:
 * 
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/select/KeycloakSelect.tsx" --revert
 */

import { JSX } from "react";
import { SelectVariant } from "../main";
import { SingleSelect } from "./SingleSelect";
import { TypeaheadSelect } from "./TypeaheadSelect";


export type Variant = `${SelectVariant}`;


export type KeycloakSelectProps = {
  toggleId?: string;
  onFilter?: (value: string) => JSX.Element[];
  onClear?: () => void;
  variant?: Variant;
  isDisabled?: boolean;
  /** Flag to indicate if select is open */
  isOpen?: boolean;
  menuAppendTo?: string;
  maxHeight?: string | number;
  width?: string | number;
  toggleIcon?: React.ReactElement;
  direction?: "up" | "down";
  placeholderText?: string;
  onSelect?: (value: string | number | object) => void;
  onToggle: (val: boolean) => void;
  selections?: string | string[] | number | number[];
  validated?: "success" | "warning" | "error" | "default";
  typeAheadAriaLabel?: string;
  chipGroupProps?: Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "ref">; // Updated for Tailwind
  chipGroupComponent?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string; // Added for customization
  /** Anything which can be rendered in a select */
  children?: React.ReactNode;
};

export const KeycloakSelect = ({
  variant = SelectVariant.single,
  ...rest
}: KeycloakSelectProps) => {
  if (variant === SelectVariant.single) {
    return <SingleSelect {...rest} />;
  } else {
    return <TypeaheadSelect {...rest} variant={variant} />;
  }
};
