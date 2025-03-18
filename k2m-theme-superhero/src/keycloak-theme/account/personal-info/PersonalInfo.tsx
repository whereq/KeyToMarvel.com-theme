/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260007.0.3.
 * To relinquish ownership and restore this file to its original content, run the following command:
 * 
 * $ npx keycloakify own --path "account/personal-info/PersonalInfo.tsx" --revert
 */

import {
  UserProfileFields,
  beerify,
  debeerify,
  setUserProfileServerError,
  useEnvironment,
} from "@keycloak-theme/shared/keycloak-ui-shared";
import { ExternalLinkSquareAltIcon } from "../../shared/@patternfly/react-icons";
import { TFunction } from "i18next";
import { useState } from "react";
import { ErrorOption, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import {
  getPersonalInfo,
  getSupportedLocales,
  savePersonalInfo,
} from "../api/methods";
import {
  UserProfileMetadata,
  UserRepresentation,
} from "../api/representations";
import { Page } from "../components/page/Page";
import type { Environment } from "../environment";
import { TFuncKey, i18n } from "../i18n";
import { useAccountAlerts } from "../utils/useAccountAlerts";
import { usePromise } from "../utils/usePromise";
import { AlertVariant } from "@patternfly/react-core";

export const PersonalInfo = () => {
  const { t } = useTranslation();
  const context = useEnvironment<Environment>();
  const [userProfileMetadata, setUserProfileMetadata] =
    useState<UserProfileMetadata>();
  const [supportedLocales, setSupportedLocales] = useState<string[]>([]);
  const form = useForm<UserRepresentation>({ mode: "onChange" });
  const { handleSubmit, reset, setValue, setError } = form;
  const { addAlert } = useAccountAlerts();

  usePromise(
    (signal) =>
      Promise.all([
        getPersonalInfo({ signal, context }),
        getSupportedLocales({ signal, context }),
      ]),
    ([personalInfo, supportedLocales]) => {
      setUserProfileMetadata(personalInfo.userProfileMetadata);
      setSupportedLocales(supportedLocales);
      reset(personalInfo);
      Object.entries(personalInfo.attributes || {}).forEach(([k, v]) =>
        setValue(`attributes[${beerify(k)}]`, v),
      );
    },
  );

  const onSubmit = async (user: UserRepresentation) => {
    try {
      const attributes = Object.fromEntries(
        Object.entries(user.attributes || {}).map(([k, v]) => [
          debeerify(k),
          v,
        ]),
      );
      await savePersonalInfo(context, { ...user, attributes });
      const locale = attributes["locale"]?.toString();
      if (locale)
        i18n.changeLanguage(locale, (error) => {
          if (error) {
            console.warn("Error(s) loading locale", locale, error);
          }
        });
      context.keycloak.updateToken();
      addAlert(t("accountUpdatedMessage"));
    } catch (error) {
      addAlert(t("accountUpdatedError"), AlertVariant.danger);

      setUserProfileServerError(
        { responseData: { errors: [{ field: "unknown", errorMessage: (error as Error).message }] } },
        (name: string | number, error: unknown) =>
          setError(name as string, error as ErrorOption),
        ((key: TFuncKey, param?: object) => t(key, param as { defaultValue: string })) as TFunction,
      );
    }
  };

  if (!userProfileMetadata) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const allFieldsReadOnly = () =>
    userProfileMetadata?.attributes
      ?.map((a) => a.readOnly)
      .reduce((p, c) => p && c, true);

  const {
    updateEmailFeatureEnabled,
    updateEmailActionEnabled,
    isRegistrationEmailAsUsername,
    isEditUserNameAllowed,
  } = context.environment.features;

  return (
    <Page title={t("personalInfo")} description={t("personalInfoDescription")}
      contentClassName="text-orange-400">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-0">
        <UserProfileFields
          form={form}
          userProfileMetadata={userProfileMetadata}
          supportedLocales={supportedLocales}
          currentLocale={context.environment.locale}
          t={
            ((key: unknown, params: object) =>
              t(key as TFuncKey, params as { defaultValue: string })) as TFunction
          }
          renderer={(attribute) =>
            attribute.name === "email" &&
            updateEmailFeatureEnabled &&
            updateEmailActionEnabled &&
            (!isRegistrationEmailAsUsername || isEditUserNameAllowed) ? (
              <button
                id="update-email-btn"
                type="button"
                className="text-blue-600 hover:text-blue-800 flex items-center"
                onClick={() =>
                  context.keycloak.login({ action: "UPDATE_EMAIL" })
                }
              >
                {t("updateEmail")}
                <ExternalLinkSquareAltIcon className="ml-2" />
              </button>
            ) : undefined
          }
        />
        {!allFieldsReadOnly() && (
          <div className="flex space-x-1 pl-4">
            <button
              data-testid="save"
              type="submit"
              id="save-btn"
              className="bg-orange-400 text-gray-100 font-bold px-4 py-2 rounded-sm hover:bg-orange-600"
            >
              {t("save")}
            </button>
            <button
              data-testid="cancel"
              id="cancel-btn"
              type="button"
              className="bg-gray-600 text-gray-100 px-4 py-2 rounded-sm hover:bg-gray-700" // Changed to secondary button
              onClick={() => reset()}
            >
              {t("cancel")}
            </button>
          </div>
        )}
        {context.environment.features.deleteAccountAllowed && (
          <div className="space-y-4">
            <details className="cursor-pointer mt-2">
              <summary className="text-red-600 hover:text-red-800">
                {t("deleteAccount")}
              </summary>
              <div className="mt-4 p-4 bg-red-50">
                <div className="text-red-800 font-bold">{t("deleteAccount")}</div>
                <p className="mt-2 text-red-700">{t("deleteAccountWarning")}</p>
                <button
                  id="delete-account-btn"
                  type="button"
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded-sm hover:bg-red-600 ring-2 ring-red-600" // Changed to red highlighted button
                  onClick={() =>
                    context.keycloak.login({
                      action: "delete_account",
                    })
                  }
                >
                  {t("delete")}
                </button>
              </div>
            </details>
          </div>
        )}
      </form>
    </Page>
  );
};

export default PersonalInfo;