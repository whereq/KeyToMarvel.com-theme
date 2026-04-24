/**
 * Development-only app entrypoint.
 * This component is rendered when no kcContext is present (outside Keycloak).
 * It provides a visual overview of the Vegeta theme design system.
 */
export default function App() {
    return (
        <div
            style={{
                minHeight: "100vh",
                background: "var(--vg-bg-base)",
                color: "var(--vg-text-primary)",
                fontFamily: "var(--vg-font-sans)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "16px",
            }}
        >
            <h1
                style={{
                    fontSize: "2.5rem",
                    fontWeight: 700,
                    color: "var(--vg-purple-500)",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    margin: 0,
                }}
            >
                K2M VEGETA THEME
            </h1>
            <p style={{ color: "var(--vg-text-secondary)", margin: 0 }}>
                Dark MetroUI · Keycloakify {"{"}keycloakify{"}"} · React 19 · Tailwind CSS 4
            </p>
            <p style={{ color: "var(--vg-text-muted)", fontSize: "0.85rem" }}>
                Run with Storybook or enable kcContext mock to preview pages.
            </p>
        </div>
    );
}
