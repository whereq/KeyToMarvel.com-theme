/**
 * Development-only app entrypoint.
 * Rendered when no kcContext is present (outside Keycloak).
 * Provides a visual overview of the whereq.cc theme design system.
 */
export default function App() {
    return (
        <div
            style={{
                minHeight: "100vh",
                background: "var(--bg)",
                color: "var(--text)",
                fontFamily: "var(--ui)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "16px",
            }}
        >
            <svg width="64" height="64" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="3" fill="var(--accent)" />
                <circle cx="20" cy="17.5" r="7.4" stroke="#fff" strokeWidth="3.2" />
                <path d="M20 25.2 L20 33.5 L25.6 27.4 Z" fill="#fff" />
            </svg>
            <h1
                style={{
                    fontSize: "2rem",
                    fontWeight: 800,
                    letterSpacing: "-0.02em",
                    margin: 0,
                    fontFamily: "var(--display)",
                    color: "var(--text-warm)",
                }}
            >
                whereq<span style={{ color: "var(--accent)" }}>.cc</span> — Keycloak theme
            </h1>
            <p style={{ color: "var(--text-dim)", margin: 0 }}>
                Encrypted-gallery brand · Keycloakify · React 19 · Tailwind CSS 4
            </p>
            <p style={{ color: "var(--text-faint)", fontSize: "0.85rem" }}>
                Run with Storybook or enable kcContext mock to preview pages.
            </p>
        </div>
    );
}
