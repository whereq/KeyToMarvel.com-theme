#!/usr/bin/env bash
# =============================================================================
# deploy.sh — Deploy k2m-theme-vegeta to the local Keycloak Docker volumes.
#
# Run this on rp4 after:
#   1. git pull (latest changes)
#   2. yarn build-keycloak-theme (produces dist_keycloak/*.jar)
#
# Usage:
#   ./deploy.sh           # deploy JAR + welcome
#   ./deploy.sh --jar     # deploy JAR only
#   ./deploy.sh --welcome # deploy welcome only
# =============================================================================
set -euo pipefail

# ── Colour helpers ────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; RESET='\033[0m'
info()    { echo -e "${CYAN}  ➜${RESET}  $*"; }
success() { echo -e "${GREEN}  ✓${RESET}  $*"; }
warn()    { echo -e "${YELLOW}  !${RESET}  $*"; }
error()   { echo -e "${RED}  ✗${RESET}  $*" >&2; }
header()  { echo -e "\n${BOLD}$*${RESET}"; }

# ── Paths ─────────────────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
THEME_NAME="k2m-theme-vegeta"

# Source
JAR_SRC="$SCRIPT_DIR/dist_keycloak/keycloak-theme-for-kc-all-other-versions.jar"
WELCOME_SRC="$SCRIPT_DIR/src/keycloak-theme/welcome"

# Target — adjust KEYCLOAK_VOLUMES_DIR if your layout differs
KEYCLOAK_VOLUMES_DIR="$HOME/github/KeyToMarvel.com/docker/volumes/keycloak"
PROVIDERS_DIR="$KEYCLOAK_VOLUMES_DIR/providers"
WELCOME_DIR="$KEYCLOAK_VOLUMES_DIR/themes/$THEME_NAME/welcome"

# ── Argument parsing ──────────────────────────────────────────────────────────
DEPLOY_JAR=true
DEPLOY_WELCOME=true

for arg in "$@"; do
    case "$arg" in
        --jar)     DEPLOY_JAR=true;  DEPLOY_WELCOME=false ;;
        --welcome) DEPLOY_JAR=false; DEPLOY_WELCOME=true  ;;
        --help|-h)
            echo "Usage: $0 [--jar | --welcome]"
            echo "  (no flags) deploy both JAR and welcome"
            echo "  --jar      deploy JAR only"
            echo "  --welcome  deploy welcome only"
            exit 0 ;;
        *) error "Unknown argument: $arg"; exit 1 ;;
    esac
done

# ── Banner ────────────────────────────────────────────────────────────────────
echo -e "${BOLD}${CYAN}"
echo "  ██╗  ██╗██████╗ ███╗   ███╗"
echo "  ██║ ██╔╝╚════██╗████╗ ████║"
echo "  █████╔╝  █████╔╝██╔████╔██║"
echo "  ██╔═██╗  ╚═══██╗██║╚██╔╝██║"
echo "  ██║  ██╗██████╔╝██║ ╚═╝ ██║"
echo "  ╚═╝  ╚═╝╚═════╝ ╚═╝     ╚═╝  Theme Deployer"
echo -e "${RESET}"

# ── Deploy JAR ────────────────────────────────────────────────────────────────
if $DEPLOY_JAR; then
    header "[ 1/2 ] JAR → providers"

    if [[ ! -f "$JAR_SRC" ]]; then
        error "JAR not found: $JAR_SRC"
        error "Run 'yarn build-keycloak-theme' first."
        exit 1
    fi

    if [[ ! -d "$PROVIDERS_DIR" ]]; then
        error "Providers directory not found: $PROVIDERS_DIR"
        exit 1
    fi

    JAR_DEST="$PROVIDERS_DIR/keycloak-theme-for-kc-all-other-versions.jar"

    # Backup existing JAR with timestamp
    if [[ -f "$JAR_DEST" ]]; then
        BACKUP="$JAR_DEST.bak.$(date +%Y%m%d-%H%M%S)"
        info "Backing up existing JAR → $(basename "$BACKUP")"
        cp "$JAR_DEST" "$BACKUP"
    fi

    info "Copying JAR → $JAR_DEST"
    cp "$JAR_SRC" "$JAR_DEST"

    JAR_SIZE=$(du -h "$JAR_DEST" | cut -f1)
    success "JAR deployed ($JAR_SIZE)"
fi

# ── Deploy welcome ────────────────────────────────────────────────────────────
if $DEPLOY_WELCOME; then
    header "[ 2/2 ] Welcome → themes"

    if [[ ! -d "$WELCOME_SRC" ]]; then
        error "Welcome source not found: $WELCOME_SRC"
        exit 1
    fi

    mkdir -p "$WELCOME_DIR"
    info "Copying welcome files → $WELCOME_DIR"
    cp -r "$WELCOME_SRC"/. "$WELCOME_DIR/"

    FILE_COUNT=$(find "$WELCOME_DIR" -type f | wc -l | tr -d ' ')
    success "Welcome deployed ($FILE_COUNT file(s))"
fi

# ── Done ──────────────────────────────────────────────────────────────────────
echo ""
success "${BOLD}Deployment complete.${RESET}"
echo ""
warn "Keycloak must be restarted to pick up the new JAR."
echo -e "  Run: ${CYAN}docker compose restart keycloak${RESET}  (or your equivalent restart command)"
echo ""
