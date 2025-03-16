/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260007.0.3.
 * To relinquish ownership and restore this file to its original content, run the following command:
 * 
 * $ npx keycloakify own --path 'account/root/Root.tsx' --revert
 */

/* eslint-disable */

// @ts-nocheck

import { KeycloakProvider } from "@keycloak-theme/shared/keycloak-ui-shared";
import { Page, Spinner } from "@keycloak-theme/shared/@patternfly/react-core";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

// import Footer from "@keycloak-theme/layout/Footer";

import { environment } from "../environment";
import { Header } from "./Header";
import { PageNav } from "./PageNav";

export const Root = () => {
  return (
    <KeycloakProvider environment={environment}>
      <Page header={<Header />} sidebar={<PageNav />} isManagedSidebar>
        <Suspense fallback={<Spinner />}>
          <Outlet />
        </Suspense>
      </Page>
    </KeycloakProvider>
  );
};
