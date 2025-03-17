/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260007.0.3.
 * To relinquish ownership and restore this file to its original content, run the following command:
 * 
 * $ npx keycloakify own --path 'account/root/PageNav.tsx' --revert
 */

import { useEnvironment } from "@keycloak-theme/shared/keycloak-ui-shared";
import {
  PropsWithChildren,
  MouseEvent as ReactMouseEvent,
  Suspense,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  matchPath,
  useHref,
  useLinkClickHandler,
  useLocation,
} from "react-router-dom";
import { BsArrowsExpand, BsArrowsCollapse, BsChevronRight } from "react-icons/bs"; // Import icons

import { content } from "@keycloak-theme/account/assets/content"; // Import content.ts directly
import { environment, type Environment, type Feature } from "@keycloak-theme/account/environment";
import { TFuncKey } from "@keycloak-theme/account/i18n";

type RootMenuItem = {
  label: TFuncKey;
  path: string;
  isVisible?: keyof Feature;
  modulePath?: string;
};

type MenuItemWithChildren = {
  label: TFuncKey;
  children: MenuItem[];
  isVisible?: keyof Feature;
};

export type MenuItem = RootMenuItem | MenuItemWithChildren;

export const PageNav = () => {
  const [menuItems] = useState<MenuItem[]>(content); // Use content.ts directly
  const context = useEnvironment<Environment>();

  return (
    <div className="w-full bg-gray-800 text-orange-400">
      <div className="p-0">
        <nav>
          <ul>
            <Suspense fallback={<div className="text-center">Loading...</div>}>
              {menuItems
                ?.filter((menuItem) =>
                  menuItem.isVisible
                    ? context.environment.features[menuItem.isVisible]
                    : true,
                )
                .map((menuItem) => (
                  <NavMenuItem
                    key={menuItem.label as string}
                    menuItem={menuItem}
                  />
                ))}
            </Suspense>
          </ul>
        </nav>
      </div>
    </div>
  );
};

type NavMenuItemProps = {
  menuItem: MenuItem;
  isSubmenu?: boolean; // Add isSubmenu prop
};

function NavMenuItem({ menuItem, isSubmenu = false }: NavMenuItemProps) {
  const { t } = useTranslation();
  const {
    environment: { features },
  } = useEnvironment<Environment>();
  const { pathname } = useLocation();
  const [isExpanded, setIsExpanded] = useState(false); // Add toggle state for expandable items
  const isActive = useMemo(
    () => matchMenuItem(pathname, menuItem),
    [pathname, menuItem],
  );

  if ("path" in menuItem) {
    return (
      <NavLink path={menuItem.path} isActive={isActive} isSubmenu={isSubmenu}>
        {t(menuItem.label)}
      </NavLink>
    );
  }

  return (
    <div 
      className={`mb-2 ${isActive ? "bg-gray-700" : "bg-gray-800"} hover:bg-gray-700`}>
      <button
        className="w-full text-lg p-2 flex items-center justify-between text-left 
                 text-orange-400 hover:text-gray-300"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {t(menuItem.label)}
        <span className="ml-2">
          {isExpanded ? (
            <BsArrowsCollapse className="text-orange-400" />
          ) : (
            <BsArrowsExpand className="text-orange-400" />
          )}
        </span>
      </button>
      {isExpanded && (
        <ul className="space-y-1">
          {menuItem.children
            .filter((menuItem) =>
              menuItem.isVisible ? features[menuItem.isVisible] : true,
            )
            .map((child) => (
              <NavMenuItem
                key={child.label as string}
                menuItem={child}
                isSubmenu={true} // Pass isSubmenu=true for submenu items
              />
            ))}
        </ul>
      )}
    </div>
  );
}

function getFullUrl(path: string) {
  return `${new URL(environment.baseUrl).pathname}${path}`;
}

function matchMenuItem(currentPath: string, menuItem: MenuItem): boolean {
  if ("path" in menuItem) {
    return !!matchPath(getFullUrl(menuItem.path), currentPath);
  }

  return menuItem.children.some((child) => matchMenuItem(currentPath, child));
}

type NavLinkProps = {
  path: string;
  isActive: boolean;
  isSubmenu?: boolean; // Add isSubmenu prop
};

export const NavLink = ({
  path,
  isActive,
  isSubmenu = false, // Default to false
  children,
}: PropsWithChildren<NavLinkProps>) => {
  const menuItemPath = getFullUrl(path) + `?${location.search}`;
  const href = useHref(menuItemPath);
  const handleClick = useLinkClickHandler(menuItemPath);

  return (
    <li>
      <a
        href={href}
        onClick={(event) =>
          handleClick(event as unknown as ReactMouseEvent<HTMLAnchorElement>)
        }
        className={`p-2 flex items-center ${
          isActive
            ? "bg-blue-800 text-gray-300"
            : "text-orange-400 hover:bg-gray-700 hover:text-gray-300"
        }`}
      >
        {isSubmenu && <BsChevronRight className="mr-2" />} {/* Conditionally render chevron icon */}
        {children}
      </a>
    </li>
  );
};
