  Debugging the Admin Theme Without a Running Backend

  Keycloakify supports a Storybook-like dev mode for the admin console. Here's how:

  Option 1: Vite Dev Server (fastest, mock data)

  cd /home/whereq/git/KeyToMarvel.com-theme/k2m-theme-vegeta
  yarn dev

  This starts Vite at http://localhost:5173 and renders the admin UI with mocked Keycloak context — no backend needed. However, the admin console pages are complex and may not all render
  perfectly in isolation.

  Option 2: Keycloakify's --external mock environment

  cd /home/whereq/git/KeyToMarvel.com-theme/k2m-theme-vegeta
  npx keycloakify start-keycloak --external

  This spins up a pre-configured Keycloak Docker container with your theme hot-reloaded. You get a real Keycloak UI but with live reloading of your theme changes — good for login/account
  pages.

  Option 3: Direct browser inspection (no rebuild)

  For the specific admin dashboard page (#/flowdesk.top), since it's a React SPA:

  1. Open http://localhost:8080/admin/master/console/#/flowdesk.top (while logged in)
  2. Open DevTools → Sources → find the bundled JS/CSS
  3. Use Local Overrides (Chrome DevTools → Sources → Overrides) to override the CSS file directly in the browser without rebuilding

  This is the fastest way to iterate on CSS changes like the spin animation — edit in DevTools, enable override, see result instantly.

  For the EmptyDashboard component specifically

  The #/flowdesk.top URL renders EmptyDashboard (non-master realm). To see it without login, you'd need a mock — but the simplest workflow is:

  1. Make CSS changes in dashboard.css
  2. Run yarn build-keycloak-theme (~20s)
  3. Copy JAR + docker restart docker-keycloak-1 (~15s)
  4. Hard-refresh the browser

  Or use Chrome DevTools Local Overrides to test CSS changes instantly without any rebuild.