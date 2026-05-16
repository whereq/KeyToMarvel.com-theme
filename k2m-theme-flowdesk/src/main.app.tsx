/**
 * Development-only app entrypoint.
 * Rendered when no kcContext is present (outside Keycloak).
 * Provides a visual overview of the FlowDesk theme design system.
 */
export default function App() {
    return (
        <div
            style={{
                minHeight: "100vh",
                background: "var(--fd-bg-base)",
                color: "var(--fd-text-primary)",
                fontFamily: "var(--fd-font-sans)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "16px",
            }}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 40 40"
                width="64"
                height="64"
            >
                <rect width="40" height="40" fill="#0d0d0d" />
                <rect x="8" y="7" width="4" height="26" fill="#0078d4" />
                <rect x="8" y="7" width="17" height="4" fill="#0078d4" />
                <rect x="8" y="17" width="13" height="4" fill="#0078d4" />
                <path d="M12 34 Q20 28 26 30 Q32 32 36 26" stroke="#00bcf2" strokeWidth="1.5" strokeLinecap="square" fill="none" opacity="0.85" />
                <path d="M12 37 Q22 32 30 34 Q36 36 38 31" stroke="#00bcf2" strokeWidth="1" strokeLinecap="square" fill="none" opacity="0.4" />
                <circle cx="26" cy="30" r="1.5" fill="#00bcf2" opacity="0.9" />
            </svg>
            <h1
                style={{
                    fontSize: "2rem",
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                    margin: 0,
                    background: "linear-gradient(90deg, #0078d4, #00bcf2)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                }}
            >
                K2M FLOWDESK THEME
            </h1>
            <p style={{ color: "var(--fd-text-secondary)", margin: 0 }}>
                Metro Dark UI · Keycloakify · React 19 · Tailwind CSS 4
            </p>
            <p style={{ color: "var(--fd-text-muted)", fontSize: "0.85rem" }}>
                Run with Storybook or enable kcContext mock to preview pages.
            </p>
        </div>
    );
}
