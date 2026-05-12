#!/usr/bin/env bash
# deploy.sh — Copy pre-built k2m-theme-vegeta artifacts to Keycloak volumes
#
# Run this on ANY machine that has the KeyToMarvel.com repo alongside this one.
# It does NOT build the JAR — run 'yarn build-keycloak-theme' first on a machine
# with Node.js/Yarn if you need a fresh JAR.
#
# Usage:
#   ./bin/deploy.sh [KEYCLOAK_VOLUMES_DIR]
#
# Default KEYCLOAK_VOLUMES_DIR (relative to this project):
#   ../../KeyToMarvel.com/docker/volumes/keycloak
#
# ─── What gets deployed and where ────────────────────────────────────────────
#
#  Artifact    │ Source (this repo)                   │ Destination
#  ────────────┼──────────────────────────────────────┼────────────────────────────────────────
#  Theme JAR   │ dist_keycloak/*.jar                  │ providers/  (JAR provider)
#  Welcome FTL │ src/keycloak-theme/welcome/index.ftl │ themes/k2m-theme-vegeta/welcome/
#
# ⚠️  DO NOT deploy login/messages/ to the themes volume.
#
#     Keycloak's filesystem ThemeProvider claims the ENTIRE login theme type when
#     themes/k2m-theme-vegeta/login/ exists on disk.  Files absent from that directory
#     (including login.ftl — the Keycloakify React SPA entry point) fall back to the
#     PARENT keycloak theme, NOT to the JAR.  Result: the React login UI is replaced
#     by the stock Keycloak PatternFly form.
#
#     Custom login message keys (avatar, firstName, etc.) are compiled into the JAR via
#     src/keycloak-theme/login/i18n.ts → withCustomTranslations().  No filesystem
#     override is needed.
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

KC_VOLUMES_DIR="${1:-$PROJECT_DIR/../../KeyToMarvel.com/docker/volumes/keycloak}"
KC_VOLUMES_DIR="$(realpath "$KC_VOLUMES_DIR")"

PROVIDERS_DIR="$KC_VOLUMES_DIR/providers"
THEME_DIR="$KC_VOLUMES_DIR/themes/k2m-theme-vegeta"

JAR_NAME="keycloak-theme-for-kc-all-other-versions.jar"
JAR_SRC="$PROJECT_DIR/dist_keycloak/$JAR_NAME"

echo "======================================="
echo " k2m-theme-vegeta deploy"
echo "======================================="
echo " Project : $PROJECT_DIR"
echo " Target  : $KC_VOLUMES_DIR"
echo ""

# Guard: JAR must exist (run yarn build-keycloak-theme first if missing)
if [[ ! -f "$JAR_SRC" ]]; then
    echo "ERROR: $JAR_SRC not found."
    echo "Run 'yarn build-keycloak-theme' first, then re-run this script."
    exit 1
fi

# ── Safety check: warn if a login/ filesystem theme override exists ───────────
LOGIN_OVERRIDE_DIR="$THEME_DIR/login"
if [[ -d "$LOGIN_OVERRIDE_DIR" ]]; then
    echo "⚠️  WARNING: $LOGIN_OVERRIDE_DIR exists."
    echo "   This directory shadows the JAR's login theme and will break the"
    echo "   Keycloakify React login UI (login.ftl falls back to stock Keycloak)."
    echo "   Rename or remove it:"
    echo "     mv \"$LOGIN_OVERRIDE_DIR\" \"${LOGIN_OVERRIDE_DIR}.disabled\""
    echo ""
fi

# ── 1. JAR → providers/ ──────────────────────────────────────────────────────
echo "[1/2] Deploying JAR..."
mkdir -p "$PROVIDERS_DIR"
cp "$JAR_SRC" "$PROVIDERS_DIR/$JAR_NAME"
echo "      → $PROVIDERS_DIR/$JAR_NAME"
echo ""

# ── 2. Welcome theme → themes/…/welcome/ ─────────────────────────────────────
# The welcome theme cannot be bundled into the JAR (Keycloakify limitation).
echo "[2/2] Deploying welcome theme..."
mkdir -p "$THEME_DIR/welcome"
cp "$PROJECT_DIR/src/keycloak-theme/welcome/index.ftl" "$THEME_DIR/welcome/index.ftl"
printf "parent=keycloak\n" > "$THEME_DIR/welcome/theme.properties"
echo "      → $THEME_DIR/welcome/"
echo ""

echo "======================================="
echo " Deploy complete"
echo "======================================="
echo ""
echo "Post-deploy checklist:"
echo "  1. Restart the Keycloak container (required in production 'start' mode):"
echo "     docker compose -f docker-compose-rp4.yml restart keycloak"
echo "  2. Verify all realms have Login theme = 'k2m-theme-vegeta'"
echo "     Keycloak Admin → <realm> → Realm settings → Themes → Login theme."
echo "  3. Verify env var KC_SPI_THEME_WELCOME_THEME=k2m-theme-vegeta in compose file."
echo "  4. Check there is NO themes/k2m-theme-vegeta/login/ directory in the volumes."
echo ""
