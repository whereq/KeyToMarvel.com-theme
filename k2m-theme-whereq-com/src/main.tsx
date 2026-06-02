import { createRoot } from "react-dom/client";
import { lazy, StrictMode, Suspense } from "react";
import { KcPage, type KcContext } from "./keycloak-theme/kc.gen";

import "./index.css";

import { getKcContextMock } from "./keycloak-theme/login/KcPageStory";

if (import.meta.env.DEV) {
    const devLocale = new URLSearchParams(window.location.search).get("ui_locales") ?? "en";

    window.kcContext = getKcContextMock({
        pageId: "login.ftl",
        // pageId: "register.ftl",
        // pageId: "login-reset-password.ftl",
        // pageId: "login-verify-email.ftl",
        // pageId: "login-otp.ftl",
        // pageId: "error.ftl",
        overrides: {
            locale: {
                currentLanguageTag: devLocale,
                supported: [
                    { url: "?ui_locales=en",    languageTag: "en",    label: "English" },
                    { url: "?ui_locales=zh-CN", languageTag: "zh-CN", label: "中文" },
                ],
            },
            social: {
                displayInfo: true,
                providers: [
                    { alias: "google",    displayName: "Google",    loginUrl: "#", providerId: "google" },
                    { alias: "microsoft", displayName: "Microsoft",  loginUrl: "#", providerId: "microsoft" },
                ],
            },
        }
    });
}

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
