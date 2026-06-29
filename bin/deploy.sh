#!/usr/bin/env bash
# =============================================================================
# deploy.sh — Deploy Keycloak themes to PROD (Raspberry Pi).
#
# Handles all themes: superhero, morph, vegeta, flowdesk, chroniq, catobigato, whereq.com.
# Each theme may include: JAR, welcome page, extra theme dirs (account/login/admin).
#
# Usage:
#   ./deploy.sh <theme>                  # full deploy: pull, build, deploy, verify
#   ./deploy.sh <theme> --skip-build     # deploy existing build artifacts only
#   ./deploy.sh <theme> --skip-pull      # build + deploy without git pull
#   ./deploy.sh <theme> --dry-run        # show what would be deployed
#   ./deploy.sh <theme> --db-only        # only check/fix DB theme assignments
#   ./deploy.sh --list                   # list available themes
#
# Theme aliases (short names):
#   superhero, morph, vegeta, flowdesk, chroniq, catobigato, whereq.com
#
# Examples:
#   ./deploy.sh vegeta                   # full deploy of vegeta theme
#   ./deploy.sh flowdesk --skip-build    # deploy pre-built flowdesk
#   ./deploy.sh --list                   # show all available themes
# =============================================================================
set -euo pipefail

# ── Colour helpers ────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; DIM='\033[2m'; RESET='\033[0m'
info()    { echo -e "${CYAN}  ➜${RESET}  $*"; }
success() { echo -e "${GREEN}  ✓${RESET}  $*"; }
warn()    { echo -e "${YELLOW}  !${RESET}  $*"; }
error()   { echo -e "${RED}  ✗${RESET}  $*" >&2; }
header()  { echo -e "\n${BOLD}$*${RESET}"; }
dim()     { echo -e "${DIM}    $*${RESET}"; }

# ── Paths ─────────────────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

KEYCLOAK_VOLUMES_DIR="$HOME/github/KeyToMarvel.com/docker/volumes/keycloak"
PROVIDERS_DIR="$KEYCLOAK_VOLUMES_DIR/providers"
THEMES_DIR="$KEYCLOAK_VOLUMES_DIR/themes"

KC_CONTAINER="keycloak-k2m"
DB_CONTAINER="whereq-db"
DB_NAME="k2m"
DB_USER="whereq"

# Build output JAR — keycloakify produces this same filename for every theme
# under <theme>/dist_keycloak/. On deploy it is renamed to <internal-name>.jar
# (see Step 3) so each theme lives in its own provider JAR in PROD.
JAR_FILENAME="keycloak-theme-for-kc-all-other-versions.jar"

# ── Theme registry ────────────────────────────────────────────────────────────
# Format: ALIAS -> DIR_NAME:INTERNAL_NAME:HAS_WELCOME:HAS_THEME_DIR
# INTERNAL_NAME = the name used inside the JAR and in the DB realm columns
# HAS_WELCOME   = y/n — whether the theme has a welcome page (FTL)
# HAS_THEME_DIR = y/n — whether dist_keycloak/theme/<name>/ has extra dirs to copy
declare -A THEME_REGISTRY=(
  [superhero]="k2m-theme-superhero:k2m-theme-superhero:n:y"
  [morph]="k2m-theme-morph:keytomarvel-com-theme:n:y"
  [vegeta]="k2m-theme-vegeta:k2m-theme-vegeta:y:n"
  [flowdesk]="k2m-theme-flowdesk:k2m-theme-flowdesk:n:n"
  [chroniq]="k2m-theme-chroniq:k2m-theme-chroniq:n:n"
  [catobigato]="k2m-theme-catobigato:k2m-theme-catobigato:n:n"
  [whereq.com]="k2m-theme-whereq-com:k2m-theme-whereq-com:n:n"
)

# Realm-to-theme assignments: which realms use which theme for which columns
# This is the source of truth. deploy.sh will verify and fix these in the DB.
# Format: REALM_NAME -> login_theme:account_theme:admin_theme:email_theme
declare -A REALM_THEME_MAP=(
  [master]="k2m-theme-vegeta:k2m-theme-vegeta:k2m-theme-vegeta:k2m-theme-vegeta"
  [whereq]="k2m-theme-vegeta:k2m-theme-vegeta:k2m-theme-vegeta:k2m-theme-vegeta"
  [catobigato]="k2m-theme-catobigato:k2m-theme-catobigato:k2m-theme-catobigato:k2m-theme-vegeta"
  [flowdesk.top]="k2m-theme-flowdesk:k2m-theme-vegeta:k2m-theme-vegeta:k2m-theme-vegeta"
  [whereq.com]="k2m-theme-whereq-com:k2m-theme-vegeta:k2m-theme-vegeta:k2m-theme-vegeta"
)

# ── Helper: parse theme registry entry ────────────────────────────────────────
parse_theme() {
  local entry="${THEME_REGISTRY[$1]}"
  IFS=':' read -r THEME_DIR THEME_INTERNAL HAS_WELCOME HAS_THEME_DIR <<< "$entry"
}

# ── Helper: list themes ──────────────────────────────────────────────────────
list_themes() {
  header "Available themes:"
  echo ""
  printf "  ${BOLD}%-14s %-28s %-20s %-8s %-10s${RESET}\n" "ALIAS" "DIRECTORY" "INTERNAL NAME" "WELCOME" "EXTRA DIRS"
  echo "  ─────────────────────────────────────────────────────────────────────────────────"
  for alias in superhero morph vegeta flowdesk chroniq catobigato whereq.com; do
    parse_theme "$alias"
    local built="n"
    [[ -f "$REPO_DIR/$THEME_DIR/dist_keycloak/$JAR_FILENAME" ]] && built="y"
    printf "  %-14s %-28s %-20s %-8s %-10s\n" "$alias" "$THEME_DIR" "$THEME_INTERNAL" "$HAS_WELCOME" "$HAS_THEME_DIR"
  done
  echo ""
}

# ── Helper: run SQL on the Keycloak DB ────────────────────────────────────────
run_sql() {
  docker exec "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" -t -A -c "$1" 2>/dev/null
}

# ── Argument parsing ──────────────────────────────────────────────────────────
THEME_ALIAS=""
SKIP_BUILD=false
SKIP_PULL=false
DRY_RUN=false
DB_ONLY=false

for arg in "$@"; do
  case "$arg" in
    --skip-build) SKIP_BUILD=true ;;
    --skip-pull)  SKIP_PULL=true ;;
    --dry-run)    DRY_RUN=true ;;
    --db-only)    DB_ONLY=true ;;
    --list)       list_themes; exit 0 ;;
    --help|-h)
      echo "Usage: $0 <theme> [--skip-build] [--skip-pull] [--dry-run] [--db-only]"
      echo ""
      echo "Themes: superhero, morph, vegeta, flowdesk, chroniq, catobigato, whereq.com"
      echo ""
      echo "Options:"
      echo "  --skip-build   Deploy existing build artifacts (skip yarn build)"
      echo "  --skip-pull    Skip git pull (use current local state)"
      echo "  --dry-run      Show what would be deployed without doing it"
      echo "  --db-only      Only verify/fix DB theme assignments"
      echo "  --list         List available themes"
      exit 0 ;;
    -*)
      error "Unknown option: $arg"
      exit 1 ;;
    *)
      if [[ -z "$THEME_ALIAS" ]]; then
        THEME_ALIAS="$arg"
      else
        error "Unexpected argument: $arg"
        exit 1
      fi ;;
  esac
done

if [[ -z "$THEME_ALIAS" ]]; then
  error "No theme specified. Use --list to see available themes."
  echo "  Usage: $0 <theme> [options]"
  exit 1
fi

# Validate theme
if [[ -z "${THEME_REGISTRY[$THEME_ALIAS]+x}" ]]; then
  error "Unknown theme: $THEME_ALIAS"
  echo "  Available: ${!THEME_REGISTRY[*]}"
  exit 1
fi

parse_theme "$THEME_ALIAS"

# ── Banner ────────────────────────────────────────────────────────────────────
echo -e "${BOLD}${CYAN}"
echo "  ██╗  ██╗██████╗ ███╗   ███╗"
echo "  ██║ ██╔╝╚════██╗████╗ ████║"
echo "  █████╔╝  █████╔╝██╔████╔██║"
echo "  ██╔═██╗  ╚═══██╗██║╚██╔╝██║"
echo "  ██║  ██╗██████╔╝██║ ╚═╝ ██║"
echo "  ╚═╝  ╚═╝╚═════╝ ╚═╝     ╚═╝  Theme Deployer"
echo -e "${RESET}"
info "Theme:    ${BOLD}$THEME_ALIAS${RESET}  ($THEME_DIR)"
info "Internal: $THEME_INTERNAL"
info "Welcome:  $HAS_WELCOME  |  Extra dirs: $HAS_THEME_DIR"
$DRY_RUN && warn "DRY RUN — no changes will be made"
echo ""

# ── Step 0: Preflight checks ─────────────────────────────────────────────────
header "[ 0/6 ] Preflight checks"

if ! docker ps --format '{{.Names}}' | grep -q "^${KC_CONTAINER}$"; then
  error "Keycloak container '$KC_CONTAINER' is not running."
  exit 1
fi
success "Keycloak container running"

if ! docker ps --format '{{.Names}}' | grep -q "^${DB_CONTAINER}$"; then
  error "Database container '$DB_CONTAINER' is not running."
  exit 1
fi
success "Database container running"

if [[ ! -d "$PROVIDERS_DIR" ]]; then
  error "Providers directory not found: $PROVIDERS_DIR"
  exit 1
fi
success "Providers directory exists"

# ── Step 1: Git pull ──────────────────────────────────────────────────────────
if ! $DB_ONLY; then
  header "[ 1/6 ] Git pull (latest from main)"

  if $SKIP_PULL; then
    dim "Skipped (--skip-pull)"
  elif $DRY_RUN; then
    dim "Would run: git pull origin main"
  else
    cd "$REPO_DIR"
    git fetch --prune origin
    CURRENT_BRANCH=$(git branch --show-current)
    if [[ "$CURRENT_BRANCH" != "main" ]]; then
      # Stash any local changes so they can't block the checkout (set -e aborts otherwise)
      if ! git diff --quiet || ! git diff --cached --quiet; then
        warn "Local changes on '$CURRENT_BRANCH' — stashing before switch"
        git stash push -u -m "deploy.sh auto-stash $(date +%Y%m%d-%H%M%S)" || true
      fi
      warn "Currently on branch '$CURRENT_BRANCH', switching to main"
      git checkout main
    fi
    git pull --ff-only origin main
    success "On main, pulled latest ($(git rev-parse --short HEAD))"
  fi
fi

# ── Step 2: Build ─────────────────────────────────────────────────────────────
if ! $DB_ONLY; then
  header "[ 2/6 ] Build theme"

  THEME_PATH="$REPO_DIR/$THEME_DIR"

  if $SKIP_BUILD; then
    dim "Skipped (--skip-build)"
  elif $DRY_RUN; then
    dim "Would run: cd $THEME_PATH && yarn install && yarn build-keycloak-theme"
  else
    if [[ ! -d "$THEME_PATH" ]]; then
      error "Theme directory not found: $THEME_PATH"
      exit 1
    fi

    cd "$THEME_PATH"
    info "Installing dependencies..."
    yarn install --frozen-lockfile 2>/dev/null || yarn install
    info "Building keycloak theme..."
    yarn build-keycloak-theme
    success "Build complete"
  fi

  # Verify build artifacts exist
  JAR_SRC="$THEME_PATH/dist_keycloak/$JAR_FILENAME"
  if [[ ! -f "$JAR_SRC" ]] && ! $DRY_RUN; then
    error "JAR not found after build: $JAR_SRC"
    exit 1
  fi
fi

# ── Step 3: Deploy JAR ───────────────────────────────────────────────────────
if ! $DB_ONLY; then
  header "[ 3/6 ] Deploy JAR → providers"

  JAR_SRC="$REPO_DIR/$THEME_DIR/dist_keycloak/$JAR_FILENAME"
  # PROD convention: one provider JAR per theme, named <internal-name>.jar
  # (e.g. k2m-theme-flowdesk.jar) so themes never overwrite each other.
  JAR_DEST="$PROVIDERS_DIR/${THEME_INTERNAL}.jar"

  if $DRY_RUN; then
    dim "Would copy: $JAR_SRC → $JAR_DEST"
  else
    # Backup existing JAR
    if [[ -f "$JAR_DEST" ]]; then
      BACKUP="$JAR_DEST.bak.$(date +%Y%m%d-%H%M%S)"
      info "Backing up existing JAR → $(basename "$BACKUP")"
      cp "$JAR_DEST" "$BACKUP"
      # Keep only last 3 backups (for this theme)
      ls -t "$PROVIDERS_DIR/${THEME_INTERNAL}.jar.bak."* 2>/dev/null | tail -n +4 | xargs -r rm -f
    fi

    cp "$JAR_SRC" "$JAR_DEST"
    JAR_SIZE=$(du -h "$JAR_DEST" | cut -f1)
    success "JAR deployed → $(basename "$JAR_DEST") ($JAR_SIZE)"
  fi
fi

# ── Step 4: Deploy welcome page + extra theme dirs ───────────────────────────
if ! $DB_ONLY; then
  header "[ 4/6 ] Deploy theme assets"

  DEPLOYED_ASSETS=0

  # Welcome page (FTL files)
  if [[ "$HAS_WELCOME" == "y" ]]; then
    WELCOME_SRC="$REPO_DIR/$THEME_DIR/src/keycloak-theme/welcome"
    WELCOME_DEST="$THEMES_DIR/$THEME_INTERNAL/welcome"

    if $DRY_RUN; then
      dim "Would copy welcome: $WELCOME_SRC → $WELCOME_DEST"
    else
      if [[ -d "$WELCOME_SRC" ]]; then
        mkdir -p "$WELCOME_DEST"
        cp -r "$WELCOME_SRC"/. "$WELCOME_DEST/"
        FILE_COUNT=$(find "$WELCOME_DEST" -type f | wc -l | tr -d ' ')
        success "Welcome page deployed ($FILE_COUNT files) → $WELCOME_DEST"
        DEPLOYED_ASSETS=$((DEPLOYED_ASSETS + 1))
      else
        warn "Welcome source not found: $WELCOME_SRC (skipping)"
      fi
    fi
  fi

  # Extra theme directories (account, login, admin, email from dist_keycloak/theme/)
  if [[ "$HAS_THEME_DIR" == "y" ]]; then
    THEME_EXTRA_SRC="$REPO_DIR/$THEME_DIR/dist_keycloak/theme/$THEME_INTERNAL"
    THEME_EXTRA_DEST="$THEMES_DIR/$THEME_INTERNAL"

    if $DRY_RUN; then
      dim "Would copy theme dirs: $THEME_EXTRA_SRC → $THEME_EXTRA_DEST"
      if [[ -d "$THEME_EXTRA_SRC" ]]; then
        dim "  Dirs: $(ls "$THEME_EXTRA_SRC" 2>/dev/null | tr '\n' ' ')"
      fi
    else
      if [[ -d "$THEME_EXTRA_SRC" ]]; then
        mkdir -p "$THEME_EXTRA_DEST"
        # Copy each subdirectory (account, login, admin, email)
        for subdir in "$THEME_EXTRA_SRC"/*/; do
          if [[ -d "$subdir" ]]; then
            SUBDIR_NAME=$(basename "$subdir")
            mkdir -p "$THEME_EXTRA_DEST/$SUBDIR_NAME"
            cp -r "$subdir"/. "$THEME_EXTRA_DEST/$SUBDIR_NAME/"
            success "Theme dir deployed: $SUBDIR_NAME → $THEME_EXTRA_DEST/$SUBDIR_NAME/"
            DEPLOYED_ASSETS=$((DEPLOYED_ASSETS + 1))
          fi
        done
      else
        warn "Theme extra dir not found: $THEME_EXTRA_SRC (skipping)"
      fi
    fi
  fi

  if [[ $DEPLOYED_ASSETS -eq 0 ]] && [[ "$HAS_WELCOME" == "n" ]] && [[ "$HAS_THEME_DIR" == "n" ]]; then
    dim "No extra assets for this theme (JAR-only)"
  fi
fi

# ── Step 5: Restart Keycloak ─────────────────────────────────────────────────
if ! $DB_ONLY; then
  header "[ 5/6 ] Restart Keycloak"

  if $DRY_RUN; then
    dim "Would run: docker restart $KC_CONTAINER"
  else
    info "Restarting $KC_CONTAINER..."
    docker restart "$KC_CONTAINER"
    # Wait for Keycloak to become healthy
    info "Waiting for Keycloak to start..."
    ATTEMPTS=0
    MAX_ATTEMPTS=30
    while [[ $ATTEMPTS -lt $MAX_ATTEMPTS ]]; do
      if docker exec "$KC_CONTAINER" curl -sf http://localhost:8080/health/ready >/dev/null 2>&1; then
        success "Keycloak is ready"
        break
      fi
      ATTEMPTS=$((ATTEMPTS + 1))
      sleep 2
    done
    if [[ $ATTEMPTS -ge $MAX_ATTEMPTS ]]; then
      warn "Keycloak health check timed out after ${MAX_ATTEMPTS}x2s — it may still be starting"
    fi
  fi
fi

# ── Step 6: Verify database theme assignments ────────────────────────────────
header "[ 6/6 ] Verify database theme assignments"

DB_ERRORS=0

for realm_name in "${!REALM_THEME_MAP[@]}"; do
  IFS=':' read -r expected_login expected_account expected_admin expected_email <<< "${REALM_THEME_MAP[$realm_name]}"

  # Query current values
  ROW=$(run_sql "SELECT login_theme, account_theme, admin_theme, email_theme FROM realm WHERE name='$realm_name';")

  if [[ -z "$ROW" ]]; then
    warn "Realm '$realm_name' not found in DB (skipping)"
    continue
  fi

  IFS='|' read -r actual_login actual_account actual_admin actual_email <<< "$ROW"

  REALM_OK=true
  UPDATES=""

  for col in login account admin email; do
    expected_var="expected_$col"
    actual_var="actual_$col"
    expected="${!expected_var}"
    actual="${!actual_var}"

    if [[ "$actual" != "$expected" ]]; then
      REALM_OK=false
      DB_ERRORS=$((DB_ERRORS + 1))
      warn "Realm '$realm_name': ${col}_theme = '$actual' (expected '$expected')"
      UPDATES+="${col}_theme='$expected', "
    fi
  done

  if $REALM_OK; then
    success "Realm '$realm_name': all theme columns correct"
  else
    # Fix the DB
    UPDATES="${UPDATES%, }"  # trim trailing comma
    if $DRY_RUN; then
      dim "Would run: UPDATE realm SET $UPDATES WHERE name='$realm_name';"
    else
      info "Fixing realm '$realm_name'..."
      run_sql "UPDATE realm SET $UPDATES WHERE name='$realm_name';"
      success "Realm '$realm_name' updated"
    fi
  fi
done

# ── Summary ───────────────────────────────────────────────────────────────────
echo ""
if $DRY_RUN; then
  success "${BOLD}Dry run complete — no changes made.${RESET}"
else
  if [[ $DB_ERRORS -gt 0 ]]; then
    success "${BOLD}Deployment complete. Fixed $DB_ERRORS DB theme assignment(s).${RESET}"
  else
    success "${BOLD}Deployment complete. All DB assignments verified.${RESET}"
  fi
fi
echo ""
