#!/usr/bin/env bash
# deploy.sh — Copy pre-built k2m-theme-vegeta artifacts to Keycloak volumes
#
# Run this on ANY machine that has the KeyToMarvel.com repo alongside this one.
# It does NOT build the JAR — run build-and-deploy.sh (or yarn build-keycloak-theme)
# first on a machine with Node.js/Yarn if you need a fresh JAR.
#
# Usage:
#   ./bin/deploy.sh [KEYCLOAK_VOLUMES_DIR]
#
# Default KEYCLOAK_VOLUMES_DIR (relative to this project):
#   ../../KeyToMarvel.com/docker/volumes/keycloak
#
# ─── What gets deployed and where ────────────────────────────────────────────
#
#  Artifact        │ Source (this repo)                           │ Destination
#  ────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────
#  Theme JAR       │ dist_keycloak/*.jar                          │ providers/  (JAR provider)
#  Welcome FTL     │ src/keycloak-theme/welcome/index.ftl         │ themes/k2m-theme-vegeta/welcome/
#  Login messages  │ src/keycloak-theme/login/messages/*.properties│ themes/k2m-theme-vegeta/login/messages/
#
# Why login messages need a separate volume mount (not just the JAR):
#   Keycloak Admin validates ${key} display names in User Profile attributes against
#   the active login theme's message bundle. The JAR also contains these keys (compiled
#   from layout/i18n.ts), but volume-mounted files take precedence and allow hotfixes
#   without a JAR rebuild.
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

# ── 1. JAR → providers/ ──────────────────────────────────────────────────────
echo "[1/3] Deploying JAR..."
mkdir -p "$PROVIDERS_DIR"
cp "$JAR_SRC" "$PROVIDERS_DIR/$JAR_NAME"
echo "      → $PROVIDERS_DIR/$JAR_NAME"
echo ""

# ── 2. Welcome theme → themes/…/welcome/ ─────────────────────────────────────
# The welcome theme cannot be bundled into the JAR (Keycloakify limitation).
echo "[2/3] Deploying welcome theme..."
mkdir -p "$THEME_DIR/welcome"
cp "$PROJECT_DIR/src/keycloak-theme/welcome/index.ftl" "$THEME_DIR/welcome/index.ftl"
printf "parent=keycloak\n" > "$THEME_DIR/welcome/theme.properties"
echo "      → $THEME_DIR/welcome/"
echo ""

# ── 3. Login message overrides → themes/…/login/messages/ ────────────────────
echo "[3/3] Deploying login message overrides..."
mkdir -p "$THEME_DIR/login/messages"
cp "$PROJECT_DIR/src/keycloak-theme/login/messages/messages_en.properties" \
   "$THEME_DIR/login/messages/messages_en.properties"
cp "$PROJECT_DIR/src/keycloak-theme/login/messages/messages_zh_CN.properties" \
   "$THEME_DIR/login/messages/messages_zh_CN.properties"
# parent=keycloak: inherit all standard Keycloak message keys not in our override file.
# The login pages (JS/CSS/FTL) still come from the JAR — only messages are overridden here.
printf "parent=keycloak\n" > "$THEME_DIR/login/theme.properties"
echo "      → $THEME_DIR/login/"
echo ""

echo "======================================="
echo " Deploy complete"
echo "======================================="
echo ""
echo "Post-deploy checklist:"
echo "  1. Restart the Keycloak container (required in production 'start' mode):"
echo "     docker compose -f docker-compose-rp4.yml restart keycloak"
echo "  2. Verify the WhereQ realm has Login theme = 'k2m-theme-vegeta'"
echo "     Keycloak Admin → WhereQ realm → Realm settings → Themes → Login theme."
echo "  3. Test: edit a User Profile attribute in Realm settings → User profile."
echo ""
