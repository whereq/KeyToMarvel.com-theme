/**
 * Development-only app entrypoint.
 * Rendered when no kcContext is present (outside Keycloak).
 * Provides a visual overview of the whereq.com theme design system.
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
            <svg width="64" height="64" viewBox="0 0 32 32" fill="none">
                <rect x="2" y="2" width="28" height="28" rx="3" fill="var(--accent)" />
                <text x="16" y="23" textAnchor="middle" fontSize="20" fontWeight={700} fontFamily="var(--ui)" fill="var(--accent-ink)">Q</text>
            </svg>
            <h1
                style={{
                    fontSize: "2rem",
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                    margin: 0,
                    color: "var(--text-warm)",
                }}
            >
                whereq<span style={{ color: "var(--accent)" }}>.</span>com — Keycloak theme
            </h1>
            <p style={{ color: "var(--text-dim)", margin: 0 }}>
                Metro / calendar.cc UI · Keycloakify · React 19 · Tailwind CSS 4
            </p>
            <p style={{ color: "var(--text-faint)", fontSize: "0.85rem" }}>
                Run with Storybook or enable kcContext mock to preview pages.
            </p>
        </div>
    );
}
