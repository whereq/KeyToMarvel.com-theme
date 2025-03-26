/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260007.0.3.
 * To relinquish ownership and restore this file to its original content, run the following command:
 * 
 * $ npx keycloakify own --path 'account/KcAccountUi.tsx' --revert
 */

// import "@patternfly/react-core/dist/styles/base.css";
// import "@patternfly/patternfly/patternfly-addons.css";
import { initializeDarkMode } from "../shared/keycloak-ui-shared";

import { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { i18n } from "./i18n";
import { routes } from "./routes";

initializeDarkMode();

const prI18nInitialized = i18n.init();

const router = createBrowserRouter(routes);

export default function KcAccountUi() {
    // const [isI18nInitialized, setI18nInitialized] = useReducer(() => true, false);
    const [isI18nInitialized, setI18nInitialized] = useState(false);

    useEffect(() => {
        prI18nInitialized.then(() => setI18nInitialized(true));
    }, []);

    if (!isI18nInitialized) {
        return null;
    }

    return <RouterProvider router={router} />;
}
