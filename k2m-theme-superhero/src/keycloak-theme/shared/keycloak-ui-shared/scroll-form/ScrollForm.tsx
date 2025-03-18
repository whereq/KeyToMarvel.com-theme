/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260007.0.5.
 * To relinquish ownership and restore this file to its original content, run the following command:
 * 
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/scroll-form/ScrollForm.tsx" --revert
 */

import { ReactNode, useMemo, useState } from "react";
import { FormPanel } from "./FormPanel";
import { ScrollPanel } from "./ScrollPanel";

export const mainPageContentId = "kc-main-content-page-container";

type ScrollSection = {
  title: string;
  panel: ReactNode;
  isHidden?: boolean;
};

type ScrollFormProps = {
  label: string;
  sections: ScrollSection[];
  borders?: boolean;
  className?: string;
};

const spacesToHyphens = (string: string): string => {
  return string.replace(/\s+/g, "-");
};

export const ScrollForm = ({
  label,
  sections,
  borders = false,
  className = "",
}: ScrollFormProps) => {
  const shownSections = useMemo(
    () => sections.filter(({ isHidden }) => !isHidden),
    [sections],
  );

  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Tabs Navigation */}
      <nav aria-label={label} className="flex space-x-4 border-b border-gray-200">
        {shownSections.map(({ title }, index) => (
          <button
            key={title}
            onClick={() => setActiveTab(index)}
            className={`px-4 py-2 text-lg font-bold ${
              activeTab === index
                ? "text-orange-400 bg-blue-700"
                : "text-orange-400 bg-gray-700"
            }`}
          >
            {title}
          </button>
        ))}
      </nav>

      {/* Tab Content */}
      <div className="flex-1 p-4 overflow-hidden">
        {shownSections.map(({ title, panel }, index) => {
          if (index !== activeTab) return null; // Only render the active tab

          const scrollId = spacesToHyphens(title.toLowerCase());

          return (
            <div key={title}>
              {borders ? (
                <FormPanel scrollId={scrollId} title={title}>
                  {panel}
                </FormPanel>
              ) : (
                <ScrollPanel scrollId={scrollId} title="">
                  {panel}
                </ScrollPanel>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};