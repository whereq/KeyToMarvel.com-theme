import { QHaulBrandMark } from "@keycloak-theme/shared/ui";

/**
 * Development-only app entrypoint.
 * Rendered when no kcContext is present (outside Keycloak).
 * Provides a visual overview of the QHaul theme design system.
 */
export default function App() {
    return (
        <div
            style={{
                minHeight: "100vh",
                background: "var(--qh-bg)",
                color: "var(--qh-text)",
                fontFamily: "var(--qh-font-sans)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "16px",
            }}
        >
            <QHaulBrandMark size={64} />
            <h1
                style={{
                    fontSize: "2rem",
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    margin: 0,
                }}
            >
                <span style={{ color: "var(--qh-navy)" }}>qhaul</span>
                <span style={{ color: "var(--qh-accent)" }}>.ca</span>
            </h1>
            <p style={{ color: "var(--qh-text-2)", margin: 0 }}>
                Metro UI · Keycloakify · React 19 · Tailwind CSS 4
            </p>
            <p style={{ color: "var(--qh-muted)", fontSize: "0.85rem" }}>
                Run with Vite dev to preview the login page.
            </p>
        </div>
    );
}
