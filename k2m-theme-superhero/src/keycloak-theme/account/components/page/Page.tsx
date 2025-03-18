/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260007.0.3.
 * To relinquish ownership and restore this file to its original content, run the following command:
 * 
 * $ npx keycloakify own --path "account/components/page/Page.tsx" --revert
 */

import { PropsWithChildren } from 'react';

type PageProps = {
  title: string;
  description: string;
  /** Additional classes for the outer container */
  className?: string;
  /** Additional classes for the title */
  titleClassName?: string;
  /** Additional classes for the description */
  descriptionClassName?: string;
  /** Additional classes for the content section */
  contentClassName?: string;
};

export const Page = ({
  title,
  description,
  children,
  className = '',
  titleClassName = '',
  descriptionClassName = '',
  contentClassName = '',
}: PropsWithChildren<PageProps>) => {
  return (
    <div className={`h-full w-full ${className}`}>
      {/* Header Section */}
      <section className="w-full bg-gray-700  border-b border-orange-700 p-2">
        <div className="w-full mx-auto flex items-center">
          <h1
            className={`text-xl font-bold text-orange-400 ${titleClassName}`}
            data-testid="page-heading"
          >
            {title}
          </h1>
          {/* Separator */}
          <div className="mx-4 h-6 w-px bg-gray-300" />
          <p className={`text-md text-orange-500 ${descriptionClassName}`}>
            {description}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className={`m-0 p-0 ${contentClassName}`}>
        <div className="w-full mx-auto">{children}</div>
      </section>
    </div>
  );
};