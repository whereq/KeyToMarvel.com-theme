/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260007.0.3.
 * To relinquish ownership and restore this file to its original content, run the following command:
 * 
 * $ npx keycloakify own --path "account/account-security/SigningIn.tsx" --revert
 */

import { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useEnvironment } from "../../shared/keycloak-ui-shared";
import { getCredentials } from "../api/methods";
import {
  CredentialContainer,
  CredentialMetadataRepresentation,
} from "../api/representations";
import { Page } from "../components/page/Page";
import { TFuncKey } from "../i18n";
import { formatDate } from "../utils/formatDate";
import { usePromise } from "../utils/usePromise";
import { EllipsisVIcon } from "../../shared/@patternfly/react-icons";

type MobileLinkProps = {
  title: string;
  onClick: () => void;
  testid?: string;
  className?: string;
};

const MobileLink = ({ title, onClick, testid, className }: MobileLinkProps) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className={`relative ${className}`}>
        <button
          onClick={() => setOpen(!open)}
          className="hidden p-2 rounded hover:bg-gray-200 focus:outline-none"
        >
          <EllipsisVIcon />
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-10">
            <button
              onClick={onClick}
              className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
            >
              {title}
            </button>
          </div>
        )}
      </div>
      <button
        onClick={onClick}
        className={`lg:inline-flex text-blue-600 hover:text-blue-800 ${className}`}
        data-testid={testid}
      >
        {title}
      </button>
    </>
  );
};

export const SigningIn = ({ className }: { className?: string }) => {
  const { t } = useTranslation();
  const context = useEnvironment();
  const { login } = context.keycloak;

  const [credentials, setCredentials] = useState<CredentialContainer[]>();

  usePromise(
    (signal) => getCredentials({ signal, context }),
    setCredentials,
    [],
  );

  const credentialRowCells = (
    credMetadata: CredentialMetadataRepresentation,
  ) => {
    const credential = credMetadata.credential;
    const items = [
      <div
        key="title"
        data-testrole="label"
        className="max-w-[300px] truncate"
      >
        {t(credential.userLabel) || t(credential.type as TFuncKey)}
      </div>,
    ];

    if (credential.createdDate) {
      items.push(
        <div key={"created" + credential.id} data-testrole="created-at">
          <Trans i18nKey="credentialCreatedAt">
            <strong className="mr-2"></strong>
            {{ date: formatDate(new Date(credential.createdDate)) }}
          </Trans>
        </div>,
      );
    }
    return items;
  };

  if (!credentials) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const credentialUniqueCategories = [
    ...new Set(credentials.map((c) => c.category)),
  ];

  return (
    <Page title={t("signingIn")} description={t("signingInDescription")} className={className}>
      {credentialUniqueCategories.map((category) => (
        <section key={category} className="px-0">
          <h2 className="text-2xl font-bold mb-2 p-4 text-orange-400" id={`${category}-categ-title`}>
            {t(category as TFuncKey)}
          </h2>
          {credentials
            .filter((cred) => cred.category == category)
            .map((container) => (
              <div key={container.type} className="mt-2 mb-2 text-orange-400">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-bold mb-2 pl-4" data-testid={`${container.type}/help`}>
                      <span className="block" data-testid={`${container.type}/title`}>
                        {t(container.displayName as TFuncKey)}
                      </span>
                    </h3>
                    <span className="pl-4" data-testid={`${container.type}/help-text`}>
                      {t(container.helptext as TFuncKey)}
                    </span>
                  </div>
                  {container.createAction && (
                    <div className="flex justify-end">
                      <MobileLink
                        onClick={() =>
                          login({
                            action: container.createAction,
                          })
                        }
                        title={t("setUpNew", {
                          name: t(`${container.type}-display-name` as TFuncKey),
                        })}
                        testid={`${container.type}/create`}
                        className="ml-4"
                      />
                    </div>
                  )}
                </div>

                <div className="mb-8" data-testid={`${container.type}/credential-list`}>
                  {container.userCredentialMetadatas.length === 0 && (
                    <div className="flex justify-center items-center p-4 border-t border-b border-orange-700">
                      <span className="text-center">
                        {t("notSetUp", {
                          name: t(container.displayName as TFuncKey),
                        })}
                      </span>
                    </div>
                  )}

                  {container.userCredentialMetadatas.map((meta) => (
                    <div key={meta.credential.id} 
                      className="border-t border-b 
                               border-orange-700 p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-4 pl-4">
                          {credentialRowCells(meta)}
                        </div>
                        <div>
                          {container.removeable ? (
                            <button
                              onClick={() => {
                                login({
                                  action: "delete_credential:" + meta.credential.id,
                                });
                              }}
                              className="bg-red-500 text-white px-4 py-2 rounded-sm hover:bg-red-600"
                              data-testrole="remove"
                            >
                              {t("delete")}
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                if (container.updateAction)
                                  login({ action: container.updateAction });
                              }}
                              className="bg-orange-400 text-gray-100 font-bold px-4 py-2 rounded-sm hover:bg-orange-600"
                              data-testrole="update"
                            >
                              {t("update")}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </section>
      ))}
    </Page>
  );
};

export default SigningIn;