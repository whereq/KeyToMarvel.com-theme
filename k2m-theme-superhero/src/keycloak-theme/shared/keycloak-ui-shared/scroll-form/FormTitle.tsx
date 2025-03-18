/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260007.0.5.
 * To relinquish ownership and restore this file to its original content, run the following command:
 * 
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/scroll-form/FormTitle.tsx" --revert
 */

import { HTMLProps } from "react";
import { TextSize } from "@keycloak-theme/shared/tailwind-css/TailwindTypes";
import { sizeToClass } from "@keycloak-theme/shared/tailwind-css/TailwindUtils";

type FormTitleProps = HTMLProps<HTMLHeadingElement> & {
  id?: string;
  title: string;
  headingLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  textSize?: TextSize | keyof typeof TextSize; // Use the TextSize enum
};

export const FormTitle = ({
  id,
  title,
  headingLevel = "h1",
  textSize = TextSize.XL,
  className = "",
  ...rest
}: FormTitleProps) => {
  const Heading = headingLevel;

  // Ensure size is properly casted for the object lookup
  const sizeClass = sizeToClass[textSize as TextSize] || "";

  return (
    <Heading
      id={id}
      className={`${sizeClass} font-bold ${className}`}
      tabIndex={0}
      {...rest}
    >
      {title}
    </Heading>
  );
};