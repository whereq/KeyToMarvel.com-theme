/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260007.0.3.
 * To relinquish ownership and restore this file to its original content, run the following command:
 * 
 * $ npx keycloakify own --path "account/account-security/DeviceActivity.tsx" --revert
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ContinueCancelModal,
  useEnvironment,
  label,
} from "../../shared/keycloak-ui-shared";
import { FaMobileScreen } from "react-icons/fa6"; 
import { FaDesktop } from "react-icons/fa6"; 
import { FaSyncAlt } from "react-icons/fa";
import { deleteSession, getDevices } from "../api/methods";
import {
  ClientRepresentation,
  DeviceRepresentation,
  SessionRepresentation,
} from "../api/representations";
import { Page } from "../components/page/Page";
import { formatDate } from "../utils/formatDate";
import { useAccountAlerts } from "../utils/useAccountAlerts";
import { usePromise } from "../utils/usePromise";

export const DeviceActivity = ({ className }: { className?: string }) => {
  const { t } = useTranslation();
  const context = useEnvironment();
  const { addAlert, addError } = useAccountAlerts();

  const [devices, setDevices] = useState<DeviceRepresentation[]>();
  const [key, setKey] = useState(0);
  const refresh = () => setKey(key + 1);

  const moveCurrentToTop = (devices: DeviceRepresentation[]) => {
    let currentDevice = devices[0];

    const index = devices.findIndex((d) => d.current);
    currentDevice = devices.splice(index, 1)[0];
    devices.unshift(currentDevice);

    const sessionIndex = currentDevice.sessions.findIndex((s) => s.current);
    const currentSession = currentDevice.sessions.splice(sessionIndex, 1)[0];
    currentDevice.sessions.unshift(currentSession);

    setDevices(devices);
  };

  usePromise((signal) => getDevices({ signal, context }), moveCurrentToTop, [
    key,
  ]);

  const signOutAll = async () => {
    await deleteSession(context);
    context.keycloak.logout();
  };

  const signOutSession = async (
    session: SessionRepresentation,
    device: DeviceRepresentation,
  ) => {
    try {
      await deleteSession(context, session.id);
      addAlert(
        t("signedOutSession", { browser: session.browser, os: device.os }),
      );
      refresh();
    } catch (error) {
      addError("errorSignOutMessage", error);
    }
  };

  const makeClientsString = (clients: ClientRepresentation[]): string => {
    let clientsString = "";
    clients.forEach((client, index) => {
      let clientName: string;
      if (client.clientName !== "") {
        clientName = label(t, client.clientName);
      } else {
        clientName = client.clientId;
      }

      clientsString += clientName;

      if (clients.length > index + 1) clientsString += ", ";
    });

    return clientsString;
  };

  if (!devices) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // Flatten all sessions into a single array to calculate global row index
  const flattenedSessions = devices.flatMap((device) =>
    device.sessions.map((session) => ({ device, session })),
  );

  return (
    <Page
      title={t("deviceActivity")}
      description={t("signedInDevicesExplanation")}
      className={`${className} text-orange-400`}
    >
      <div className="flex justify-between items-center mb-6 p-4">
        <h2 className="text-2xl font-bold">{t("signedInDevices")}</h2>
        <div className="flex space-x-4">
          <button
            onClick={refresh}
            className="text-blue-300 hover:text-orange-800 flex items-center"
          >
            <FaSyncAlt className="mr-2" />
            {t("refreshPage")}
          </button>

          {(devices.length > 1 || devices[0].sessions.length > 1) && (
            <ContinueCancelModal
              buttonTitle={t("signOutAllDevices")}
              modalTitle={t("signOutAllDevices")}
              continueLabel={t("confirm")}
              cancelLabel={t("cancel")}
              onContinue={() => signOutAll()}
            >
              {t("signOutAllDevicesWarning")}
            </ContinueCancelModal>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {flattenedSessions.map(({ device, session }, globalIndex) => (
          <div
            key={`${device.id}-${globalIndex}`}
            className={`p-4 ${globalIndex % 2 === 0 ? "bg-gray-800" : "bg-gray-700"} rounded border border-gray-600`}
            data-testid={`row-${globalIndex}`}
          >
            {/* Header Row */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                {device.mobile ? (
                  <FaMobileScreen className="text-lg" />
                ) : (
                  <FaDesktop className="text-lg" />
                )}
                <span className="font-semibold">
                  {device.os.toLowerCase().includes("unknown")
                    ? t("unknownOperatingSystem")
                    : device.os}{" "}
                  {!device.osVersion.toLowerCase().includes("unknown") &&
                    device.osVersion}{" "}
                  / {session.browser}
                </span>
                {session.current && (
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-sm rounded-sm">
                    {t("currentSession")}
                  </span>
                )}
              </div>
              <div className="text-right">
                {!session.current && (
                  <ContinueCancelModal
                    buttonTitle={t("signOut")}
                    modalTitle={t("signOut")}
                    continueLabel={t("confirm")}
                    cancelLabel={t("cancel")}
                    buttonVariant="secondary"
                    onContinue={() => signOutSession(session, device)}
                  >
                    {t("signOutWarning")}
                  </ContinueCancelModal>
                )}
              </div>
            </div>

            {/* Details Grid */}
            <div
              className="grid" // Use Tailwind for gap
              style={{ gridTemplateColumns: "1fr 3fr" }} // Use inline styles for custom column widths
            >
              <div className="p-2 bg-gray-700 border border-gray-600">{t("ipAddress")}</div>
              <div className="p-2 bg-gray-700 border border-gray-600">{session.ipAddress}</div>

              <div className="p-2 bg-gray-800 border border-gray-600">{t("lastAccessedOn")}</div>
              <div className="p-2 bg-gray-800 border border-gray-600">{formatDate(new Date(session.lastAccess * 1000))}</div>

              <div className="p-2 bg-gray-700 border border-gray-600">{t("clients")}</div>
              <div className="p-2 bg-gray-700 border border-gray-600">{makeClientsString(session.clients)}</div>

              <div className="p-2 bg-gray-900 border border-gray-600">{t("started")}</div>
              <div className="p-2 bg-gray-900 border border-gray-600">{formatDate(new Date(session.started * 1000))}</div>

              <div className="p-2 bg-gray-700 border border-gray-600">{t("expires")}</div>
              <div className="p-2 bg-gray-700 border border-gray-600">{formatDate(new Date(session.expires * 1000))}</div>
            </div>
          </div>
        ))}
      </div>
    </Page>
  );
};

export default DeviceActivity;