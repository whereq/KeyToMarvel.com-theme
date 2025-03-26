/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260007.0.3.
 * To relinquish ownership and restore this file to its original content, run the following command:
 * 
 * $ npx keycloakify own --path 'account/root/Header.tsx' --revert
 */

import { type KeycloakTokenParsed } from "keycloak-js";
import { TFunction } from "i18next";

import { useTranslation } from "react-i18next";
import { ExternalLinkSquareAltIcon } from "@keycloak-theme/shared/@patternfly/react-icons";
import { PiYinYangFill } from "react-icons/pi";
import { Environment, environment } from "@keycloak-theme/account/environment";
import { label, useEnvironment } from "@keycloak-theme/shared/keycloak-ui-shared";
import { CiMenuKebab } from "react-icons/ci"; 
import { RxAvatar, RxTriangleUp, RxTriangleDown } from "react-icons/rx";
import { useState } from "react"; // Add useState for dropdown toggle

import { FaSquareCaretLeft, FaSquareCaretRight } from "react-icons/fa6"; // Import the new icons
import { usePageNavStore } from "@keycloak-theme/store/account-store"; // Import the Zustand store
// Add imports for fetching personal info
import { getPersonalInfo } from "../api/methods";
import { usePromise } from "../utils/usePromise";
import type { UserRepresentation } from "../api/representations";

function loggedInUserName(token: KeycloakTokenParsed | undefined, t: TFunction) {
    if (!token) {
        return t("unknownUser");
    }

    const givenName = token.given_name;
    const familyName = token.family_name;
    const preferredUsername = token.preferred_username;

    if (givenName && familyName) {
        return t("fullName", { givenName, familyName });
    }

    return givenName || familyName || preferredUsername || t("unknownUser");
}

const hasLogout = true;
const hasManageAccount = true;
const hasUsername = true;

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
  const context = useEnvironment<Environment>();
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

  // Fetch personal info to get the avatar URL
  const [personalInfo, setPersonalInfo] = useState<UserRepresentation | undefined>(undefined);
  usePromise(
    (signal) => getPersonalInfo({ signal, context }),
    (personalInfo) => {
      setPersonalInfo(personalInfo);
    },
  );

  // Set the avatar URL from personalInfo.attributes.avatar if it exists and is a valid string
  const avatar = personalInfo?.attributes?.avatar?.[0] && typeof personalInfo.attributes.avatar[0] === "string" 
    ? personalInfo.attributes.avatar[0]
    : undefined;

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
              title={
                hasUsername
                  ? loggedInUserName(keycloak.idTokenParsed, t)
                  : undefined
              }
            />
          </div>
          <div className="md:hidden">
            <KeycloakDropdown data-testid="options-kebab" isKebab dropDownItems={[extraItems]} />
          </div>
          {avatar ? (
            <div className="ml-auto">
              <img src={avatar} alt={t("avatar")} className="h-8 w-8 rounded-full" />
            </div>
          ) : (
            <RxAvatar size={36} className="mr-2" color="orange" />
          )}
        </div>
      </div>
    </div>
  );
};