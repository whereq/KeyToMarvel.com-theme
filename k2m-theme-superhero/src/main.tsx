import { createRoot } from "react-dom/client";
import { lazy, StrictMode, Suspense } from "react";
import { KcPage, type KcContext } from "./keycloak-theme/kc.gen";

import "./index.css";

// The following block can be uncommented to test a specific page with `yarn dev`
// Don't forget to comment back or your bundle size will increase
/*
import { getKcContextMock } from "./keycloak-theme/login/KcPageStory";

if (import.meta.env.DEV) {
    window.kcContext = getKcContextMock({
        // pageId: "login.ftl",
        // pageId: "register.ftl",
        pageId: "login-update-profile.ftl",
        overrides: {}
    });
}
*/

// Lazy load the MainApp component
const AppEntrypoint = lazy(() => import("./main.app"));

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {!window.kcContext ? (
      <Suspense fallback={<div>Loading...</div>}>
        <AppEntrypoint />
      </Suspense>
    ) : (
      <KcPage kcContext={window.kcContext} />
    )}
  </StrictMode>
);

declare global {
  interface Window {
    kcContext?: KcContext;
  }
}