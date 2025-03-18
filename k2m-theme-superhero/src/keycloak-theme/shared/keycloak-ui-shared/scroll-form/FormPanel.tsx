/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260007.0.5.
 * To relinquish ownership and restore this file to its original content, run the following command:
 * 
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/scroll-form/FormPanel.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { PropsWithChildren, useId } from "react";
import { FormTitle } from "./FormTitle";

type FormPanelProps = {
  title: string;
  scrollId?: string;
  className?: string;
};

export const FormPanel = ({
  title,
  children,
  scrollId,
  className = "", // Added default empty string
}: PropsWithChildren<FormPanelProps>) => {
  const id = useId();

  return (
    <div id={id} className={`border border-gray-300 rounded-md ${className}`}> {/* Replaced Card */}
      <header className="p-4 border-b border-gray-300"> {/* Replaced CardHeader */}
        <h1 tabIndex={0} className="text-lg font-semibold"> {/* Replaced CardTitle */}
          <FormTitle id={scrollId} title={title} />
        </h1>
      </header>
      <div className="p-4"> {/* Replaced CardBody */}
        {children}
      </div>
    </div>
  );
};