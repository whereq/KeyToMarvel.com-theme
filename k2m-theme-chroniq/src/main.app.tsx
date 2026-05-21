/**
 * Development-only app entrypoint.
 * Rendered when no kcContext is present (outside Keycloak).
 * Provides a visual overview of the Chroniq theme design system.
 */
export default function App() {
    return (
        <div
            style={{
                minHeight: "100vh",
                background: "var(--cq-bg)",
                color: "var(--cq-text)",
                fontFamily: "var(--cq-font-body)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "16px",
            }}
        >
            {/* Chroniq calendar logo mark */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" width="64" height="64">
                <rect x="10" y="3" width="3" height="7" rx="1.5" fill="#3A3A45" />
                <rect x="23" y="3" width="3" height="7" rx="1.5" fill="#3A3A45" />
                <rect x="4" y="7" width="28" height="24" rx="2" fill="#131318" stroke="#2A2A33" strokeWidth="1" />
                <rect x="4" y="7" width="28" height="7" rx="2" fill="#FF5A4E" />
                <circle cx="18" cy="22" r="7" fill="none" stroke="#0091FF" strokeWidth="2" />
                <line x1="23.5" y1="27.5" x2="27" y2="31" stroke="#0091FF" strokeWidth="2" strokeLinecap="round" />
                <rect x="14" y="19" width="5" height="5" rx="1" fill="#FFB400" opacity="0.9" />
            </svg>
            <h1
                style={{
                    fontSize: "2rem",
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    margin: 0,
                    fontFamily: "var(--cq-font-display)",
                }}
            >
                <span style={{ color: "var(--cq-text)" }}>chroniq</span>
                <span style={{ color: "var(--cq-accent)" }}>.cc</span>
            </h1>
            <p style={{ color: "var(--cq-text-2)", margin: 0 }}>
                Metro UI · Keycloakify · React 19 · Tailwind CSS 4
            </p>
            <p style={{ color: "var(--cq-muted)", fontSize: "0.85rem" }}>
                Run with Vite dev to preview the login page.
            </p>
        </div>
    );
}
