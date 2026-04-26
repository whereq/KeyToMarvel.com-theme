#!/usr/bin/env bash
# deploy.sh — Build k2m-theme-vegeta and deploy artifacts to Keycloak volumes
#
# Usage:
#   ./bin/deploy.sh [KEYCLOAK_VOLUMES_DIR]
#
# Default KEYCLOAK_VOLUMES_DIR (relative to this project):
#   ../../KeyToMarvel.com/docker/volumes/keycloak
#
# ─── What gets deployed and where ────────────────────────────────────────────
#
#  Theme type  │ Source                                      │ Destination
#  ────────────┼─────────────────────────────────────────────┼──────────────────────────────────────────────
#  login       │ dist_keycloak/*.jar  (built from src/)      │ providers/  (JAR provider)
#  account     │ dist_keycloak/*.jar                         │ providers/  (JAR provider)
#  admin       │ dist_keycloak/*.jar                         │ providers/  (JAR provider)
#  email       │ dist_keycloak/*.jar                         │ providers/  (JAR provider)
#  welcome     │ src/keycloak-theme/welcome/index.ftl        │ themes/k2m-theme-vegeta/welcome/  (FTL)
#  login msgs  │ src/keycloak-theme/login/messages/*.props   │ themes/k2m-theme-vegeta/login/messages/
#
# The welcome theme cannot be bundled into the JAR (Keycloakify limitation).
# The login messages override takes precedence over JAR messages, enabling hotfixes
# to user-profile i18n keys without a full JAR rebuild.
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

KC_VOLUMES_DIR="${1:-$PROJECT_DIR/../../KeyToMarvel.com/docker/volumes/keycloak}"
KC_VOLUMES_DIR="$(realpath "$KC_VOLUMES_DIR")"

PROVIDERS_DIR="$KC_VOLUMES_DIR/providers"
THEME_DIR="$KC_VOLUMES_DIR/themes/k2m-theme-vegeta"

JAR_NAME="keycloak-theme-for-kc-all-other-versions.jar"

echo "======================================="
echo " k2m-theme-vegeta deploy"
echo "======================================="
echo " Project : $PROJECT_DIR"
echo " Target  : $KC_VOLUMES_DIR"
echo ""

# ── Step 1: Build theme JAR ──────────────────────────────────────────────────
echo "[1/4] Building Keycloak theme JAR..."
cd "$PROJECT_DIR"
yarn build-keycloak-theme
echo "      Done."
echo ""

# ── Step 2: Deploy JAR → providers/ ─────────────────────────────────────────
echo "[2/4] Deploying JAR..."
mkdir -p "$PROVIDERS_DIR"
cp "$PROJECT_DIR/dist_keycloak/$JAR_NAME" "$PROVIDERS_DIR/$JAR_NAME"
echo "      → $PROVIDERS_DIR/$JAR_NAME"
echo ""

# ── Step 3: Deploy welcome theme → themes/…/welcome/ ────────────────────────
# The welcome theme is not bundled by Keycloakify; it must be mounted as raw FTL.
echo "[3/4] Deploying welcome theme..."
mkdir -p "$THEME_DIR/welcome"
cp "$PROJECT_DIR/src/keycloak-theme/welcome/index.ftl" "$THEME_DIR/welcome/index.ftl"
printf "parent=keycloak\n" > "$THEME_DIR/welcome/theme.properties"
echo "      → $THEME_DIR/welcome/"
echo ""

# ── Step 4: Deploy login message overrides → themes/…/login/messages/ ───────
# These keys resolve ${firstName}, ${lastName}, etc. in User Profile attribute
# display names, preventing the Admin Console error:
#   "Please add translations before saving: {{error}}"
# The volume-mounted file takes precedence over the JAR's compiled messages.
echo "[4/4] Deploying login message overrides..."
mkdir -p "$THEME_DIR/login/messages"
cp "$PROJECT_DIR/src/keycloak-theme/login/messages/messages_en.properties" \
   "$THEME_DIR/login/messages/messages_en.properties"
cp "$PROJECT_DIR/src/keycloak-theme/login/messages/messages_zh_CN.properties" \
   "$THEME_DIR/login/messages/messages_zh_CN.properties"
# parent=keycloak lets Keycloak inherit all standard login message keys.
# Only the keys defined above are overridden; everything else comes from the parent.
printf "parent=keycloak\n" > "$THEME_DIR/login/theme.properties"
echo "      → $THEME_DIR/login/"
echo ""

echo "======================================="
echo " Deploy complete"
echo "======================================="
echo ""
echo "Post-deploy checklist:"
echo "  1. Restart the Keycloak container (or use start-dev which auto-reloads FTL)."
echo "  2. Verify the WhereQ realm has Login theme = 'k2m-theme-vegeta'"
echo "     Keycloak Admin → WhereQ realm → Realm settings → Themes → Login theme."
echo "  3. Test: edit a User Profile attribute display name in Realm settings → User profile."
echo ""
