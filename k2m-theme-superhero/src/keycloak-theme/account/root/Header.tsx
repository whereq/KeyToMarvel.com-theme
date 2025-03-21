/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260007.0.3.
 * To relinquish ownership and restore this file to its original content, run the following command:
 * 
 * $ npx keycloakify own --path 'account/root/Header.tsx' --revert
 */


import { useTranslation } from "react-i18next";
import { ExternalLinkSquareAltIcon } from "@keycloak-theme/shared/@patternfly/react-icons";
import { PiYinYangFill } from "react-icons/pi";
import { environment } from "@keycloak-theme/account/environment";
import { label, useEnvironment } from "@keycloak-theme/shared/keycloak-ui-shared";
import { CiMenuKebab } from "react-icons/ci"; 
import { RxAvatar, RxTriangleUp, RxTriangleDown } from "react-icons/rx";
import { useState } from "react"; // Add useState for dropdown toggle

import { FaSquareCaretLeft, FaSquareCaretRight } from "react-icons/fa6"; // Import the new icons
import { usePageNavStore } from "@keycloak-theme/store/account-store"; // Import the Zustand store

const hasLogout = true;
const hasManageAccount = true;

const ReferrerLink = () => {
  const { t } = useTranslation();

  return environment.referrerUrl ? (
    <a
      data-testid="referrer-link"
      href={environment.referrerUrl.replace("_hash_", "#")}
      className="flex items-center text-orange-400 hover:text-orange-300 mr-2"
    >
      {t("backTo", {
        app: label(t, environment.referrerName, environment.referrerUrl),
      })}
      <ExternalLinkSquareAltIcon className="ml-1" />
    </a>
  ) : null;
};

const DropdownItem = ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="block w-full px-4 py-2 text-left text-orange-400 hover:bg-gray-700"
    >
      {children}
    </button>
  );
};

const KeycloakDropdown = ({
  dropDownItems,
  title,
  isKebab = false,
}: {
  dropDownItems: React.ReactNode[];
  title?: string;
  isKebab?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false); // State to manage dropdown visibility

  return (
    <div className="relative">
      <button
        className="flex items-center text-orange-400 hover:text-orange-300"
        onClick={() => setIsOpen(!isOpen)} // Toggle dropdown on click
      >
        {title && <span className="mr-0">{title}</span>}
        {isKebab ? (
          // Use CiMenuKebab for the kebab menu
          <CiMenuKebab className="h-6 w-6" />
        ) : (
          // Use IoIosArrowDown or IoIosArrowUp based on dropdown state
          isOpen ? <RxTriangleUp className="h-6 w-6" /> : <RxTriangleDown className="h-6 w-6" />
        )}
      </button>
      {isOpen && ( // Conditionally render dropdown menu
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800">
          <div className="py-1">
            {dropDownItems.map((item, index) => (
              <div key={index}>{item}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const Header = () => {
  const { keycloak } = useEnvironment();
  const { t } = useTranslation();
  const { isPageNavOpen, togglePageNav } = usePageNavStore(); // Use Zustand store
  const toolbarItems = [<ReferrerLink key="link" />];

  const extraItems = [];
  if (hasManageAccount) {
    extraItems.push(
      <DropdownItem
        key="manageAccount"
        onClick={() => keycloak.accountManagement()}
      >
        {t("manageAccount")}
      </DropdownItem>
    );
  }
  if (hasLogout) {
    extraItems.push(
      <DropdownItem key="signOut" onClick={() => keycloak.logout()}>
        {t("signOut")}
      </DropdownItem>
    );
  }

  const picture = ""; // Should come from keycloak.idTokenParsed?.picture

  return (
    <div
      id="kc-header"
      className="border-b-2 border-orange-700 bg-blue-700 h-[3.125rem] 
                 flex items-center px-4 fixed top-0 left-0 right-0 z-50 w-full"
    >
      <div
        id="kc-header-wrapper"
        className="flex items-center h-full border-orange-700"
      >
        <button
          onClick={togglePageNav}
          className="text-orange-400 hover:text-orange-300 mr-2"
        >
          {isPageNavOpen ? (
            <FaSquareCaretLeft size={24} />
          ) : (
            <FaSquareCaretRight size={24} />
          )}
        </button>

        <PiYinYangFill size={36} color="orange" className="mr-2" />
        <span className="text-orange-400 font-bold">Key To Marvel</span>
      </div>

      <div id="k2m-header-toolbar" 
           className="ml-auto flex items-center h-full bg-gray-800 px-4 rounded-sm absolute right-0">
        <div className="flex items-center h-full space-x-4 divide-x-2 divide-orange-700">
          {toolbarItems.map((item, index) => (
            <div key={index} className="mr-2">
              {item}
            </div>
          ))}
          <div className="hidden md:block p-1">
            <KeycloakDropdown
              data-testid="options"
              dropDownItems={[extraItems]}
              title={t("fullName", { givenName: "John", familyName: "Doe" })}
            />
          </div>
          <div className="md:hidden">
            <KeycloakDropdown data-testid="options-kebab" isKebab dropDownItems={[extraItems]} />
          </div>
          {picture ? (
            <div className="ml-auto">
              <img src={picture} alt={t("avatar")} className="h-8 w-8 rounded-full" />
            </div>
          ) : (
            <RxAvatar size={36} className="mr-2" color="orange" />
          )}
        </div>
      </div>
    </div>
  );
};