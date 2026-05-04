/**
 * Custom Welcome Panel for k2m-theme-vegeta account console.
 * This is a fresh-owned component (not from keycloakify upstream).
 */

export const WelcomePanel = () => {
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
      {/* Spinning golden YinYang — matches favicon.svg */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        width={72}
        height={72}
        style={{
          filter: "drop-shadow(0 0 16px #f59e0b55) drop-shadow(0 0 4px #fbbf24)",
          animation: "spin 25s linear infinite",
        }}
        aria-hidden="true"
      >
        <circle cx="50" cy="50" r="50" fill="#0f1120"/>
        <path d="M50,0 A50,50,0,0,1,50,100 L50,0 Z" fill="#f59e0b"/>
        <circle cx="50" cy="25" r="25" fill="#f59e0b"/>
        <circle cx="50" cy="75" r="25" fill="#0f1120"/>
        <circle cx="50" cy="25" r="10" fill="#0f1120"/>
        <circle cx="50" cy="75" r="10" fill="#f59e0b"/>
      </svg>

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
          Your unified identity and access management platform. Manage your account, security, and connected applications.
        </p>
      </div>

      {/* CSS for spin animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
