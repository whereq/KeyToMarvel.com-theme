/**
 * WARNING: Before modifying this file, run the following command:
 * 
 * $ npx keycloakify own --path 'account/root/Header.tsx'
 * 
 * This file is provided by @keycloakify/keycloak-account-ui version 260007.0.3.
 * It was copied into your repository by the postinstall script: `keycloakify sync-extensions`.
 */

/* eslint-disable */

// @ts-nocheck

import logoSvgUrl from "../assets/logo.svg";
import {
  KeycloakMasthead,
  label,
  useEnvironment,
} from "../../../shared/keycloak-ui-shared";
import { Button } from "../../../shared/@patternfly/react-core";
import { ExternalLinkSquareAltIcon } from "../../../shared/@patternfly/react-icons";
import { useTranslation } from "react-i18next";
import { useHref } from "react-router-dom";

import { environment } from "../../environment";
import { joinPath } from "../../utils/joinPath";

import style from "./header.module.css";

const ReferrerLink = () => {
  const { t } = useTranslation();

  return environment.referrerUrl ? (
    <Button
      data-testid="referrer-link"
      component="a"
      href={environment.referrerUrl.replace("_hash_", "#")}
      variant="link"
      icon={<ExternalLinkSquareAltIcon />}
      iconPosition="right"
      isInline
    >
      {t("backTo", {
        app: label(t, environment.referrerName, environment.referrerUrl),
      })}
    </Button>
  ) : null;
};

export const Header = () => {
  const { environment, keycloak } = useEnvironment();
  const { t } = useTranslation();

  
  const logoUrl = environment.logoUrl ? environment.logoUrl : "/";
  const internalLogoHref = useHref(logoUrl);

  // User can indicate that he wants an internal URL by starting it with "/"
  const indexHref = logoUrl.startsWith("/") ? internalLogoHref : logoUrl;

  return (
    <KeycloakMasthead
      data-testid="page-header"
      keycloak={keycloak}
      features={{ hasManageAccount: false }}
      brand={{
        href: indexHref,
        src: logoSvgUrl,
        alt: t("logo"),
        className: style.brand,
      }}
      toolbarItems={[<ReferrerLink key="link" />]}
    />
  );
};
