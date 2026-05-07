/**
 * Custom Welcome Panel for k2m-theme-vegeta account console.
 * This is a fresh-owned component (not from keycloakify upstream).
 */

import { useTranslation } from "react-i18next";
import { VgYinYangIcon } from "@keycloak-theme/shared/ui";

export const WelcomePanel = () => {
  const { t } = useTranslation();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: "20px",
        padding: "40px 32px 32px",
        background: "linear-gradient(180deg, #0f1123 0%, #171a2e 100%)",
        borderBottom: "1px solid #272c48",
        marginBottom: "8px",
      }}
    >
      <VgYinYangIcon
        size={72}
        spinning
        style={{ filter: "drop-shadow(0 0 16px #f59e0b55) drop-shadow(0 0 4px #fbbf24)" }}
      />

      {/* Title + tagline */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <h2
          style={{
            margin: 0,
            fontSize: "1.75rem",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            background: "linear-gradient(135deg, #f5c518 0%, #00c9e4 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Key to Marvel
        </h2>
        <p
          style={{
            margin: 0,
            fontSize: "0.85rem",
            color: "#8892b4",
            lineHeight: 1.5,
            maxWidth: "360px",
          }}
        >
          {t("headerTagline")}
        </p>
      </div>

    </div>
  );
};
