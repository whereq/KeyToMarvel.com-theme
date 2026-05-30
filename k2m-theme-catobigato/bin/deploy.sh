#!/usr/bin/env bash
set -euo pipefail

# ── Config ────────────────────────────────────────────────────────────────────
THEME_NAME="k2m-theme-catobigato"
JAR_NAME="${THEME_NAME}.jar"
CONTAINER="keycloak-k2m"
PROVIDERS_VOLUME="$HOME/github/KeyToMarvel.com/docker/volumes/keycloak/providers"
COMPOSE_DIR="$HOME/github/KeyToMarvel.com/docker"
COMPOSE_FILE="docker-compose-rp4.yml"

# The source repo — resolve relative to this script
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
THEME_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# Keycloakify outputs two JARs; KC 26+ uses "all-other-versions"
BUILD_JAR="$THEME_DIR/dist_keycloak/keycloak-theme-for-kc-all-other-versions.jar"

# ── Helpers ───────────────────────────────────────────────────────────────────
info()  { printf "\033[1;36m▸ %s\033[0m\n" "$*"; }
ok()    { printf "\033[1;32m✓ %s\033[0m\n" "$*"; }
fail()  { printf "\033[1;31m✗ %s\033[0m\n" "$*" >&2; exit 1; }

# ── Pre-flight checks ────────────────────────────────────────────────────────
command -v yarn  >/dev/null 2>&1 || fail "yarn not found"
command -v docker >/dev/null 2>&1 || fail "docker not found"
[ -d "$PROVIDERS_VOLUME" ]       || fail "Providers volume not found: $PROVIDERS_VOLUME"
[ -f "$COMPOSE_DIR/$COMPOSE_FILE" ] || fail "Compose file not found: $COMPOSE_DIR/$COMPOSE_FILE"

# ── Step 1: Build ─────────────────────────────────────────────────────────────
info "Building theme JAR …"
cd "$THEME_DIR"
yarn install --frozen-lockfile
yarn build
npx keycloakify build
[ -f "$BUILD_JAR" ] || fail "Build JAR not found: $BUILD_JAR"
ok "Built $(du -h "$BUILD_JAR" | cut -f1) JAR"

# ── Step 2: Deploy JAR to providers volume ────────────────────────────────────
info "Deploying $JAR_NAME to $PROVIDERS_VOLUME …"
cp "$BUILD_JAR" "$PROVIDERS_VOLUME/$JAR_NAME"
ok "JAR deployed"

# ── Step 3: Restart Keycloak ──────────────────────────────────────────────────
info "Restarting $CONTAINER …"
cd "$COMPOSE_DIR"
docker compose -f "$COMPOSE_FILE" restart keycloak
ok "Container restarting"

# ── Step 4: Wait for healthy ──────────────────────────────────────────────────
info "Waiting for Keycloak to become healthy …"
MAX_WAIT=120
ELAPSED=0
while [ $ELAPSED -lt $MAX_WAIT ]; do
    STATUS=$(docker inspect --format='{{.State.Health.Status}}' "$CONTAINER" 2>/dev/null || echo "unknown")
    if [ "$STATUS" = "healthy" ]; then
        ok "Keycloak is healthy (${ELAPSED}s)"
        break
    fi
    sleep 5
    ELAPSED=$((ELAPSED + 5))
done

if [ "$STATUS" != "healthy" ]; then
    fail "Keycloak did not become healthy within ${MAX_WAIT}s (status: $STATUS)"
fi

# ── Step 5: Verify theme is served ───────────────────────────────────────────
info "Verifying theme …"
SERVED_THEME=$(curl -sf "http://localhost:8888/realms/catobigato/protocol/openid-connect/auth?client_id=catobigato&redirect_uri=https%3A%2F%2Fwww.catobigato.com&response_type=code&scope=openid" \
    | grep -oP 'themeName = "\K[^"]+' || echo "unknown")

if [ "$SERVED_THEME" = "$THEME_NAME" ]; then
    ok "Verified: Keycloak is serving $THEME_NAME"
else
    fail "Expected theme '$THEME_NAME' but got '$SERVED_THEME'"
fi

echo ""
ok "Deploy complete!"
