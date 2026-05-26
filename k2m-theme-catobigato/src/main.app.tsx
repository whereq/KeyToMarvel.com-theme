export default function App() {
    return (
        <div
            style={{
                minHeight: "100vh",
                background: "var(--cb-bg-base)",
                color: "var(--cb-text-primary)",
                fontFamily: "var(--cb-font-sans)",
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
                    color: "var(--cb-orange-500)",
                    margin: 0,
                }}
            >
                K2M CATOBIGATO THEME
            </h1>
            <p style={{ color: "var(--cb-text-secondary)", margin: 0 }}>
                Warm Cream · Keycloakify · React 19 · Tailwind CSS 4
            </p>
            <p style={{ color: "var(--cb-text-muted)", fontSize: "0.85rem" }}>
                Run with Storybook or enable kcContext mock to preview pages.
            </p>
        </div>
    );
}
