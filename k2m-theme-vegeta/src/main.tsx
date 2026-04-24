import { createRoot } from "react-dom/client";
import { lazy, StrictMode, Suspense } from "react";
import { KcPage, type KcContext } from "./keycloak-theme/kc.gen";

import "./index.css";

// Uncomment to test a specific page with `yarn dev` / `npm run dev`
/*
import { getKcContextMock } from "./keycloak-theme/login/KcPageStory";

if (import.meta.env.DEV) {
    window.kcContext = getKcContextMock({
        pageId: "login.ftl",
        // pageId: "register.ftl",
        // pageId: "login-reset-password.ftl",
        // pageId: "login-verify-email.ftl",
        // pageId: "login-otp.ftl",
        overrides: {}
    });
}
*/

const AppEntrypoint = lazy(() => import("./main.app"));

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        {!window.kcContext ? (
            <Suspense fallback={null}>
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
