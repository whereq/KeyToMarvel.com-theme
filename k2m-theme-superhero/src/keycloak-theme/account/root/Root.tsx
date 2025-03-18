/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260007.0.3.
 * To relinquish ownership and restore this file to its original content, run the following command:
 * 
 * $ npx keycloakify own --path 'account/root/Root.tsx' --revert
 */

import { KeycloakProvider } from "@keycloak-theme/shared/keycloak-ui-shared";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

import Footer from "@keycloak-theme/layout/Footer";

import { environment } from "@keycloak-theme/account/environment";
import { Header } from "@keycloak-theme/account/root/Header";
import { PageNav } from "@keycloak-theme/account/root/PageNav";

import { usePageNavStore } from "@keycloak-theme/store/account-store"; // Import the Zustand store

export const Root = () => {
  const { isPageNavOpen } = usePageNavStore(); // Use Zustand store

  return (
    <KeycloakProvider environment={environment}>
      <div className="flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="fixed top-0 left-0 w-full h-[3.125rem] bg-gray-800 z-50">
          <Header />
        </header>

        {/* Main Content Area */}
        <div className="flex flex-1 pt-[3.125rem] pb-[3.125rem]">
          {/* PageNav */}
          <nav
            className={`fixed left-0 h-[calc(100vh-6.25rem)] 
                        border-r-2 border-orange-700 bg-gray-800 text-white 
                        overflow-y-auto transition-width duration-300 ease-in-out ${isPageNavOpen ? "w-[12.125rem]" : "w-0"
              }`}
          >
            <PageNav />
          </nav>

          {/* Main Area */}
          <main className={`flex-1 overflow-y-auto bg-gray-900 transition-width duration-300 ease-in-out 
                            ${isPageNavOpen ? "ml-[12.125rem]" : "ml-0"
            }`}
          >
            <Suspense fallback={<div className="text-center">Loading...</div>}>
              <Outlet />
            </Suspense>
          </main>
        </div>

        {/* Footer */}
        <footer className="fixed bottom-0 left-0 w-full h-[3.125rem] bg-gray-800 text-white z-50">
          <Footer />
        </footer>
      </div>
    </KeycloakProvider>
  );
};