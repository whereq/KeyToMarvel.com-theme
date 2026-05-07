<#-- Vegeta Theme — Keycloak Welcome Page -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Key to Marvel</title>
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%230f1120'/%3E%3Cpath d='M50,0 A50,50,0,0,1,50,100 L50,0 Z' fill='%23f59e0b'/%3E%3Ccircle cx='50' cy='25' r='25' fill='%23f59e0b'/%3E%3Ccircle cx='50' cy='75' r='25' fill='%230f1120'/%3E%3Ccircle cx='50' cy='25' r='10' fill='%230f1120'/%3E%3Ccircle cx='50' cy='75' r='10' fill='%23f59e0b'/%3E%3C/svg%3E"/>
    <style>
        :root {
            --vg-bg-base: #080a12;
            --vg-bg-card: #171a2e;
            --vg-bg-panel: #0f1123;
            --vg-border: #272c48;
            --vg-purple: #7c6bfa;
            --vg-cyan: #00c9e4;
            --vg-gold: #f5c518;
            --vg-text: #eeeffe;
            --vg-muted: #8892b4;
            --vg-radius-sm: 2px;
            --vg-radius-md: 4px;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            background: var(--vg-bg-base);
            color: var(--vg-text);
            font-family: 'Segoe UI', system-ui, sans-serif;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }

        /* ── Split layout ── */
        .split {
            display: flex;
            flex: 1;
            min-height: calc(100vh - 80px);
        }

        /* ── Left brand panel ── */
        .brand-panel {
            flex: 1;
            background: var(--vg-bg-panel);
            border-right: 1px solid var(--vg-border);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 48px 40px;
            gap: 32px;
        }

        /* ── YinYang spinner (same detailed SVG as admin logo) ── */
        .yinyang {
            display: inline-block;
            width: 96px;
            height: 96px;
            animation: spin 25s linear infinite;
            filter: drop-shadow(0 0 18px #f59e0b55) drop-shadow(0 0 4px #fbbf24);
        }

        @keyframes spin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
        }

        .brand-text {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 10px;
        }

        .brand-title {
            font-size: 2.2rem;
            font-weight: 700;
            letter-spacing: -0.02em;
            line-height: 1.1;
            background: linear-gradient(135deg, var(--vg-gold) 0%, var(--vg-cyan) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .brand-tagline {
            font-size: 0.9rem;
            color: var(--vg-muted);
            line-height: 1.6;
            max-width: 300px;
        }

        .bullets {
            list-style: none;
            width: 100%;
            max-width: 320px;
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        .bullets li {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px 14px;
            border-radius: var(--vg-radius-sm);
            background: #1a1d30;
            font-size: 0.82rem;
            color: var(--vg-muted);
        }

        .bullets li::before {
            content: '';
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: var(--vg-purple);
            flex-shrink: 0;
        }

        /* ── Right content panel ── */
        .content-panel {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 48px 40px;
        }

        .content-card {
            background: var(--vg-bg-card);
            border: 1px solid var(--vg-border);
            border-top: 3px solid var(--vg-purple);
            border-radius: var(--vg-radius-md);
            max-width: 520px;
            width: 100%;
            padding: 40px 36px;
        }

        .content-card .brand {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 28px;
        }

        .content-card .brand-bar {
            width: 4px;
            height: 24px;
            background: var(--vg-cyan);
        }

        .content-card .brand-name {
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            color: var(--vg-muted);
        }

        .content-card h1 {
            font-size: 1.6rem;
            font-weight: 700;
            color: var(--vg-text);
            margin-bottom: 10px;
            letter-spacing: -0.01em;
        }

        .content-card h1 span { color: var(--vg-purple); }

        .subtitle {
            font-size: 0.85rem;
            color: var(--vg-muted);
            line-height: 1.65;
            margin-bottom: 32px;
        }

        .tile-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-bottom: 28px;
        }

        .tile {
            padding: 18px 16px;
            background: #1e2238;
            border: 1px solid var(--vg-border);
            border-top: 2px solid transparent;
            border-radius: var(--vg-radius-sm);
            text-decoration: none;
            display: flex;
            flex-direction: column;
            gap: 6px;
            transition: border-color 150ms ease, background 150ms ease;
        }

        .tile:hover {
            border-color: var(--vg-purple);
            background: #252840;
        }

        .tile-label {
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            color: var(--vg-muted);
        }

        .tile-title {
            font-size: 0.9rem;
            font-weight: 600;
            color: var(--vg-text);
        }

        .tile-desc {
            font-size: 0.75rem;
            color: var(--vg-muted);
            line-height: 1.45;
        }

        .tile.primary   { border-top-color: var(--vg-cyan); }
        .tile.primary   .tile-label { color: var(--vg-cyan); }

        .tile.secondary { border-top-color: var(--vg-gold); }
        .tile.secondary .tile-label { color: var(--vg-gold); }

        .tile.acct-btn  { border-top-color: var(--vg-purple); }
        .tile.acct-btn  .tile-label { color: var(--vg-purple); }

        .tile.community   { border-top-color: #2ed573; }
        .tile.community   .tile-label { color: #2ed573; }

        .login-btn {
            display: block;
            width: 100%;
            padding: 14px;
            background: #252a45;
            color: var(--vg-text);
            font-size: 0.9rem;
            font-weight: 700;
            text-align: center;
            text-decoration: none;
            border: 1px solid var(--vg-purple);
            border-radius: var(--vg-radius-sm);
            transition: background 150ms ease, border-color 150ms ease, transform 80ms ease;
        }

        .login-btn:hover {
            background: #2e3455;
            border-color: #8b7bfb;
            transform: translateY(-1px);
        }

        /* ── Footer ── */
        footer {
            padding: 20px 40px;
            font-size: 11px;
            color: #555e80;
            text-align: center;
            border-top: 1px solid var(--vg-border);
        }

        footer p { margin-top: 4px; font-size: 0.75rem; color: #444b68; }

        /* ── Mobile ── */
        @media (max-width: 768px) {
            .split { flex-direction: column; }
            .brand-panel {
                border-right: none;
                border-bottom: 1px solid var(--vg-border);
                padding: 40px 24px;
                gap: 24px;
            }
            .content-panel { padding: 40px 24px; }
            .tile-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
<#assign isAuth = (auth?? && auth.principal??)>

<div class="split">
    <!-- Left: Brand Panel -->
    <div class="brand-panel">
        <div class="yinyang" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 40" width="96" height="96">
  <defs>
    <linearGradient id="k2m-text-grad-w" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24"/>
      <stop offset="100%" stop-color="#22d3ee"/>
    </linearGradient>
  </defs>

  <!-- Spinning golden YinYang (same design as admin logo.svg) -->
  <g transform="translate(18, 20)">
    <circle cx="0" cy="0" r="15" fill="none" stroke="#f59e0b" stroke-width="0.8" opacity="0.45"/>
    <g>
      <circle cx="0" cy="0" r="14" fill="#0f1120"/>
      <path d="M0,-14 A14,14 0 0,1 0,14 L0,-14 Z" fill="#f59e0b"/>
      <circle cx="0" cy="-7" r="7" fill="#f59e0b"/>
      <circle cx="0" cy="7" r="7" fill="#0f1120"/>
      <circle cx="0" cy="-7" r="2.8" fill="#0f1120"/>
      <circle cx="0" cy="7" r="2.8" fill="#f59e0b"/>
      <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="25s" repeatCount="indefinite"/>
    </g>
  </g>
</svg>
        </div>
        <div class="brand-text">
            <h1 class="brand-title">Key to Marvel</h1>
            <p class="brand-tagline">
                Your unified identity and access management platform.
            </p>
        </div>
        <ul class="bullets">
            <li>Unified single sign-on across all applications</li>
            <li>Secure identity management and access control</li>
            <li>Social login (WeChat, Google) and MFA support</li>
        </ul>
    </div>

    <!-- Right: Content Panel -->
    <div class="content-panel">
        <div class="content-card">
            <div class="brand">
                <div class="brand-bar"></div>
                <span class="brand-name">${productName}</span>
            </div>

            <h1>Welcome to <span>${productName}</span></h1>
            <p class="subtitle">
            <#if isAuth>
                You are signed in. Access your account or manage settings below.
            <#else>
                Your identity and access management platform is ready.<br/>
                Sign in to manage your account, security, and connected applications.
            </#if>
            </p>

            <div class="tile-grid">
            <#if adminConsoleEnabled>
                <a href="${adminUrl}" class="tile primary">
                    <span class="tile-label">Admin</span>
                    <span class="tile-title">Administration Console</span>
                    <span class="tile-desc">Manage realms, clients, users, and identity providers.</span>
                </a>
            </#if>

            <a href="${properties.documentationUrl!'https://www.keycloak.org/documentation'}"
               class="tile secondary" target="_blank" rel="noopener noreferrer">
                <span class="tile-label">Docs</span>
                <span class="tile-title">Documentation</span>
                <span class="tile-desc">Guides, API references, and how-to articles.</span>
            </a>

            <#if isAuth>
                <a href="/realms/whereq/account/" class="tile acct-btn">
                    <span class="tile-label">Account</span>
                    <span class="tile-title">Your Account</span>
                    <span class="tile-desc">Personal info, security, and connected apps.</span>
                </a>
                <a href="${properties.communityUrl!'https://www.keycloak.org/community'}"
                   class="tile community" target="_blank" rel="noopener noreferrer">
                    <span class="tile-label">Community</span>
                    <span class="tile-title">Community</span>
                    <span class="tile-desc">Forums, mailing lists, and GitHub.</span>
                </a>
            <#else>
                <a href="/realms/whereq/account/"
                   class="tile acct-btn">
                    <span class="tile-label">Login</span>
                    <span class="tile-title">Sign In</span>
                    <span class="tile-desc">Access your account and manage your identity.</span>
                </a>
                <a href="${properties.communityUrl!'https://www.keycloak.org/community'}"
                   class="tile community" target="_blank" rel="noopener noreferrer">
                    <span class="tile-label">Community</span>
                    <span class="tile-title">Community</span>
                    <span class="tile-desc">Forums, mailing lists, and GitHub.</span>
                </a>
            </#if>
            </div>

            <#if !isAuth>
            <a href="/realms/whereq/account/"
               class="login-btn">
                Sign In to Your Account
            </a>
            </#if>
        </div>
    </div>
</div>

<footer>
    &copy; ${.now?string("yyyy")} ${productName} &mdash; Vegeta Theme by KeyToMarvel
    <p>Powered by Keycloak &bull; Secure identity management</p>
</footer>

</body>
</html>
