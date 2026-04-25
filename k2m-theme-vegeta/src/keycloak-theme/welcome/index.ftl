<#-- Vegeta Theme — Keycloak Welcome Page -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Welcome to ${productName}</title>
    <link rel="icon" type="image/png" href="${resourcesPath}/img/favicon.png"/>
    <style>
        :root {
            --vg-bg-base: #080a12;
            --vg-bg-card: #171a2e;
            --vg-border: #272c48;
            --vg-purple: #7c6bfa;
            --vg-cyan: #00c9e4;
            --vg-gold: #f5c518;
            --vg-text: #eeeffe;
            --vg-muted: #8892b4;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            background: var(--vg-bg-base);
            color: var(--vg-text);
            font-family: 'Segoe UI', system-ui, sans-serif;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 32px 16px;
        }

        .card {
            background: var(--vg-bg-card);
            border: 1px solid var(--vg-border);
            border-top: 3px solid var(--vg-purple);
            max-width: 680px;
            width: 100%;
            padding: 48px 40px;
        }

        .brand {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 32px;
        }

        .brand-bar {
            width: 4px;
            height: 28px;
            background: var(--vg-cyan);
        }

        .brand-name {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            color: var(--vg-muted);
        }

        h1 {
            font-size: 2rem;
            font-weight: 700;
            color: var(--vg-text);
            margin-bottom: 12px;
            letter-spacing: -0.02em;
        }

        h1 span { color: var(--vg-purple); }

        .subtitle {
            font-size: 0.9rem;
            color: var(--vg-muted);
            line-height: 1.7;
            margin-bottom: 40px;
        }

        .tile-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 12px;
            margin-bottom: 32px;
        }

        .tile {
            padding: 20px 16px;
            background: #1e2238;
            border: 1px solid var(--vg-border);
            text-decoration: none;
            display: flex;
            flex-direction: column;
            gap: 8px;
            transition: border-color 150ms ease, background 150ms ease;
        }

        .tile:hover {
            border-color: var(--vg-purple);
            background: #252840;
        }

        .tile-label {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            color: var(--vg-muted);
        }

        .tile-title {
            font-size: 0.95rem;
            font-weight: 600;
            color: var(--vg-text);
        }

        .tile-desc {
            font-size: 0.78rem;
            color: var(--vg-muted);
            line-height: 1.5;
        }

        .tile.primary { border-top: 2px solid var(--vg-cyan); }
        .tile.primary .tile-label { color: var(--vg-cyan); }

        .tile.secondary { border-top: 2px solid var(--vg-gold); }
        .tile.secondary .tile-label { color: var(--vg-gold); }

        footer {
            margin-top: 48px;
            font-size: 11px;
            color: #555e80;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="brand">
            <div class="brand-bar"></div>
            <span class="brand-name">${productName}</span>
        </div>

        <h1>Welcome to <span>${productName}</span></h1>
        <p class="subtitle">
            Your identity and access management platform is running.<br/>
            Log in to the Administration Console to configure realms, clients, and users.
        </p>

        <div class="tile-grid">
            <#if adminConsoleEnabled>
            <a href="${adminUrl}" class="tile primary">
                <span class="tile-label">Admin</span>
                <span class="tile-title">Administration Console</span>
                <span class="tile-desc">Manage realms, clients, users, and identity providers.</span>
            </a>
            </#if>

            <a href="${properties.documentationUrl!'https://www.keycloak.org/documentation'}" class="tile secondary" target="_blank" rel="noopener noreferrer">
                <span class="tile-label">Docs</span>
                <span class="tile-title">Documentation</span>
                <span class="tile-desc">Guides, API references, and how-to articles.</span>
            </a>

            <a href="${properties.communityUrl!'https://www.keycloak.org/community'}" class="tile" target="_blank" rel="noopener noreferrer">
                <span class="tile-label">Community</span>
                <span class="tile-title">Community</span>
                <span class="tile-desc">Forums, mailing lists, and GitHub discussions.</span>
            </a>
        </div>
    </div>

    <footer>
        &copy; ${.now?string("yyyy")} ${productName} — Vegeta Theme by KeyToMarvel
    </footer>
</body>
</html>
