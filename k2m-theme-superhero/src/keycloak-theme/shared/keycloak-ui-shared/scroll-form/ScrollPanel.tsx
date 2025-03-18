/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260007.0.5.
 * To relinquish ownership and restore this file to its original content, run the following command:
 * 
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/scroll-form/ScrollPanel.tsx" --revert
 */

import { HTMLProps } from "react";
import { FormTitle } from "./FormTitle";

type ScrollPanelProps = HTMLProps<HTMLFormElement> & {
  title: string;
  scrollId: string;
  className?: string;
};

export const ScrollPanel = (props: ScrollPanelProps) => {
  const { title, children, scrollId, className = "", ...rest } = props;
  return (
    <section
      {...rest}
      className={`mt-6 ${className}`} // Already had className, kept as-is
    >
      <FormTitle id={scrollId} title={title} />
      <div className="mt-4">{children}</div>
    </section>
  );
};