/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260007.0.3.
 * To relinquish ownership and restore this file to its original content, run the following command:
 * 
 * $ npx keycloakify own --path "account/groups/Groups.tsx" --revert
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useEnvironment } from "../../shared/keycloak-ui-shared";
import { getGroups } from "../api/methods";
import { Group } from "../api/representations";
import { Page } from "../components/page/Page";
import { usePromise } from "../utils/usePromise";

export const Groups = ({ className }: { className?: string }) => {
  const { t } = useTranslation();
  const context = useEnvironment();

  const [groups, setGroups] = useState<Group[]>([]);
  const [directMembership, setDirectMembership] = useState(false);

  usePromise(
    (signal) => getGroups({ signal, context }),
    (groups) => {
      if (!directMembership) {
        groups.forEach((el) =>
          getParents(
            el,
            groups,
            groups.map(({ path }) => path),
          ),
        );
      }
      setGroups(groups);
    },
    [directMembership],
  );

  const getParents = (el: Group, groups: Group[], groupsPaths: string[]) => {
    const parentPath = el.path.slice(0, el.path.lastIndexOf("/"));
    if (parentPath && !groupsPaths.includes(parentPath)) {
      el = {
        name: parentPath.slice(parentPath.lastIndexOf("/") + 1),
        path: parentPath,
      };
      groups.push(el);
      groupsPaths.push(parentPath);

      getParents(el, groups, groupsPaths);
    }
  };

  return (
    <Page title={t("groups")} description={t("groupDescriptionLabel")} className={className}>
      <div id="groups-list" aria-label={t("groups")} className="space-y-0">
        {/* Direct Membership Checkbox */}
        <div className="flex items-center p-4 bg-gray-700 text-orange-400">
          <label htmlFor="directMembership-checkbox" className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="directMembership-checkbox"
              data-testid="directMembership-checkbox"
              checked={directMembership}
              onChange={(e) => setDirectMembership(e.target.checked)}
              className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
            />
            <span>{t("directMembership")}</span>
          </label>
        </div>

        {/* Header Row */}
        <div 
          className="grid gap-4 p-4 bg-gray-800 text-orange-400 font-bold"
          style={{ gridTemplateColumns: "1fr 5fr 3fr"}} >
          <div>{t("name")}</div>
          <div>{t("path")}</div>
          <div>{t("directMembership")}</div>
        </div>

        {/* Group Items */}
        {groups.map((group, appIndex) => (
          <div
            key={"group-" + appIndex}
            className="grid gap-4 p-4 bg-gray-800 text-orange-400"
            style={{ gridTemplateColumns: "1fr 5fr 3fr" }} 
            aria-labelledby="groups-list"
          >
            <div data-testid={`group[${appIndex}].name`}>{group.name}</div>
            <div id={`${appIndex}-group-path`}>{group.path}</div>
            <div id={`${appIndex}-group-directMembership`} className="flex items-center">
              <input
                type="checkbox"
                id={`${appIndex}-checkbox-directMembership`}
                checked={group.id != null}
                disabled={true}
                className="rounded border-gray-300 text-orange-400 focus:ring-red-600 cursor-not-allowed"
              />
            </div>
          </div>
        ))}
      </div>
    </Page>
  );
};

export default Groups;