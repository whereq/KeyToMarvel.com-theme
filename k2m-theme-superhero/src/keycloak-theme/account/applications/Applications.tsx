/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260007.0.3.
 * To relinquish ownership and restore this file to its original content, run the following command:
 * 
 * $ npx keycloakify own --path "account/applications/Applications.tsx" --revert
 */

import {
  ContinueCancelModal,
  label,
  useEnvironment,
} from "../../shared/keycloak-ui-shared";
import { CheckIcon, ExternalLinkAltIcon, InfoAltIcon } from "../../shared/@patternfly/react-icons";
import { RxTriangleRight, RxTriangleDown } from "react-icons/rx";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { deleteConsent, getApplications } from "../api/methods";
import { ClientRepresentation } from "../api/representations";
import { Page } from "../components/page/Page";
import { TFuncKey } from "../i18n";
import { formatDate } from "../utils/formatDate";
import { useAccountAlerts } from "../utils/useAccountAlerts";
import { usePromise } from "../utils/usePromise";

type Application = ClientRepresentation & {
  open: boolean;
};

export const Applications = ({ className = "" }: { className?: string }) => {
  const { t } = useTranslation();
  const context = useEnvironment();
  const { addAlert, addError } = useAccountAlerts();

  const [applications, setApplications] = useState<Application[]>();
  const [key, setKey] = useState(1);
  const refresh = () => setKey(key + 1);

  usePromise(
    (signal) => getApplications({ signal, context }),
    (clients) => setApplications(clients.map((c) => ({ ...c, open: false }))),
    [key],
  );

  const toggleOpen = (clientId: string) => {
    setApplications([
      ...applications!.map((a) =>
        a.clientId === clientId ? { ...a, open: !a.open } : a,
      ),
    ]);
  };

  const removeConsent = async (id: string) => {
    try {
      await deleteConsent(context, id);
      refresh();
      addAlert(t("removeConsentSuccess"));
    } catch (error) {
      addError("removeConsentError", error);
    }
  };

  if (!applications) {
    return <div className="flex justify-center items-center"><span className="animate-spin h-5 w-5 border-2 border-t-blue-600 rounded-full"></span></div>;
  }

  return (
    <Page title={t("application")} description={t("applicationsIntroMessage")} className={className}>
      <div id="applications-list" className="space-y-0" aria-label={t("application")}>
        {/* Header Row */}
        <div 
          id="applications-list-header" 
          className="grid bg-gray-900 text-orange-400 border-b border-orange-700" 
          style={{ gridTemplateColumns: "3fr 2fr 2fr" }}
          aria-labelledby="Columns names"
        >
          <div className="p-4 font-bold text-left">{t("name")}</div>
          <div className="p-4 font-bold text-left">{t("applicationType")}</div>
          <div className="p-4 font-bold text-left">{t("status")}</div>
        </div>

        {/* Application Items */}
        {applications.map((application) => (
          <div
            key={application.clientId}
            className="bg-gray-800 text-orange-400 border-b border-orange-700"
            data-testid="applications-list-item"
            aria-labelledby="applications-list"
          >
            {/* Row */}
            <div 
              className="grid items-center bg-gray-700 text-lg" 
              style={{ gridTemplateColumns: "3fr 2fr 2fr", margin: "0", padding: "0" }}
            >
              <div className="flex items-center">
                <button
                  onClick={() => toggleOpen(application.clientId)}
                  className="w-10 flex-shrink-0 text-orange-400 hover:text-gray-800 mr-2"
                  id={`toggle-${application.clientId}`}
                  aria-controls={`content-${application.clientId}`}
                  aria-expanded={application.open}
                >
                  {application.open ? <RxTriangleDown /> : <RxTriangleRight />}
                </button>
                {application.effectiveUrl ? (
                  <a
                    href={application.effectiveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-orange-800 flex items-center capitalize"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {label(t, application.clientName || application.clientId)}{" "}
                    <ExternalLinkAltIcon className="ml-1" />
                  </a>
                ) : (
                  label(t, application.clientName || application.clientId)
                )}
              </div>

              <div className="pl-4">
                {application.userConsentRequired ? t("thirdPartyApp") : t("internalApp")}
                {application.offlineAccess ? ", " + t("offlineAccess") : ""}
              </div>
              <div className="pl-4">
                {application.inUse ? t("inUse") : t("notInUse")}
              </div>
            </div>

            {/* Expanded Content */}
            {application.open && (
              <div
                id={`content-${application.clientId}`}
                className="p-4 pl-14 bg-gray-800"
                aria-label={t("applicationDetails", { clientId: application.clientId })}
              >

                <div className="space-y-2">
                  <div className="flex flex-col pl-4">
                    <div className="w-1/4 font-semibold">{t("client")}</div>
                    <div className="w-3/4">{application.clientId}</div>
                  </div>
                  {application.description && (
                    <div className="flex flex-col pl-4">
                      <div className="w-1/4 font-semibold">{t("description")}</div>
                      <div className="w-3/4">{application.description}</div>
                    </div>
                  )}
                  {application.effectiveUrl && (
                    <div className="flex flex-col pl-4">
                      <div className="w-1/4 font-semibold">URL</div>
                      <div className="w-3/4">{application.effectiveUrl.split('"')}</div>
                    </div>
                  )}
                  {application.consent && (
                    <>
                      <div className="flex flex-col pl-4">
                        <div className="w-1/4 font-semibold">{t("hasAccessTo")}</div>
                        <div className="w-full mt-1 space-y-1">
                          {application.consent.grantedScopes.map((scope) => (
                            <div key={`scope${scope.id}`} className="flex items-center">
                              <CheckIcon className="mr-2" /> {t(scope.name as TFuncKey)}
                            </div>
                          ))}
                        </div>
                      </div>
                      {application.tosUri && (
                        <div className="flex flex-col pl-4">
                          <div className="w-1/4 font-semibold">{t("termsOfService")}</div>
                          <div className="w-3/4">{application.tosUri}</div>
                        </div>
                      )}
                      {application.policyUri && (
                        <div className="flex flex-col pl-4">
                          <div className="w-1/4 font-semibold">{t("privacyPolicy")}</div>
                          <div className="w-3/4">{application.policyUri}</div>
                        </div>
                      )}
                      {application.logoUri && (
                        <div className="flex flex-col pl-4">
                          <div className="w-1/4 font-semibold">{t("logo")}</div>
                          <div className="w-3/4"><img src={application.logoUri} alt="logo" /></div>
                        </div>
                      )}
                      <div className="flex flex-col pl-4">
                        <div className="w-1/4 font-semibold">{t("accessGrantedOn")}</div>
                        <div className="w-3/4">{formatDate(new Date(application.consent.createdDate))}</div>
                      </div>
                    </>
                  )}
                </div>

                {(application.consent || application.offlineAccess) && (
                  <div className="mt-4">
                    <hr className="border-gray-300" />
                    <div className="flex flex-col gap-2 mt-2">
                      <ContinueCancelModal
                        buttonTitle={t("removeAccess")}
                        modalTitle={t("removeAccess")}
                        continueLabel={t("confirm")}
                        cancelLabel={t("cancel")}
                        buttonVariant="secondary"
                        onContinue={() => removeConsent(application.clientId)}
                      >
                        {t("removeModalMessage", { name: application.clientId })}
                      </ContinueCancelModal>
                      <div className="flex items-center text-gray-600">
                        <InfoAltIcon className="mr-2" /> {t("infoMessage")}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </Page>
  );
};

export default Applications;