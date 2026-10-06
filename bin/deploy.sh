#!/usr/bin/env bash
# =============================================================================
# deploy.sh — Deploy Keycloakify themes to PROD Keycloak (whereq).
# =============================================================================
# Can run on PROD directly OR be invoked from LOCAL via auto-SSH
# (LAN first, fall back to cloudflared ssh.whereq.cc).
#
# Handles every theme in the repo:
#   superhero, morph, vegeta, flowdesk, chroniq, catobigato, whereq.com, whereq.cc, qhaul.ca
# Each theme may include: JAR, welcome page (FTL), extra theme dirs.
#
# Usage (run on PROD):
#   ./deploy.sh <theme> [options]
#   ./deploy.sh --all
#   ./deploy.sh --status
#
# Usage (run on LOCAL — auto-SSH to PROD):
#   ./deploy.sh <theme> [options]
#   ./deploy.sh --all
#
# Theme aliases:
#   superhero, morph, vegeta, flowdesk, chroniq, catobigato, whereq.com, whereq.cc, qhaul.ca
#
# Options:
#   --all                       Deploy all themes in sequence (skip-build + skip-pull on 2nd+ runs)
#   --status                    Audit PROD state without changing anything (no rebuild, no restart)
#   --verify                    Like --status but exits 1 if any drift detected
#   --skip-build                Use existing build artifacts (skip yarn build-keycloak-theme)
#   --skip-pull                 Skip git pull (use current local state)
#   --dry-run                   Show what would be deployed without doing it
#   --db-only                   Only check/fix DB theme assignments (no build, no restart)
#   --no-restart                Deploy + verify DB but don't restart Keycloak
#   --purge-client-overrides    Also clear any client_attributes login_theme overrides
#                               for managed realms (idempotency safeguard; default off)
#   --target <host>             Override SSH target (skip auto-detect). e.g. whereq@whereq
#   --local                     Run locally instead of SSH-ing (assumes you're on PROD)
#   --list                      List available themes
#   -h, --help                  Show this help
#
# Typical flow (from LOCAL):
#   bin/deploy.sh vegeta                   # full deploy of vegeta
#   bin/deploy.sh flowdesk --skip-build    # re-deploy pre-built flowdesk only
#   bin/deploy.sh --status                 # see what's deployed + any drift
#   bin/deploy.sh --all                    # rebuild + redeploy every theme (long!)
#   bin/deploy.sh --all --skip-build       # redeploy every theme with existing builds
#
# Environment overrides:
#   K2M_SSH_TARGET            Override the SSH target (same as --target)
#   K2M_REPO_DIR              Override repo path on PROD (default: ~/git/KeyToMarvel.com-theme)
#   K2M_KC_CONTAINER          Override Keycloak container name (default: keycloak-k2m)
#   K2M_DB_CONTAINER          Override DB container name (default: whereq-db)
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

# ── Paths & remote ────────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# ── Theme registry ────────────────────────────────────────────────────────────
# Format: ALIAS -> DIR_NAME:INTERNAL_NAME:HAS_WELCOME:HAS_THEME_DIR:EXTRA_TYPE
#
#   DIR_NAME       = k2m-theme-<name> (the local package directory)
#   INTERNAL_NAME  = the directory name inside the JAR under theme/ — this is what
#                    the DB realm rows must point at. May differ from DIR_NAME
#                    (e.g. morph → keytomarvel-com-theme)
#   HAS_WELCOME    = y/n — whether to copy src/keycloak-theme/welcome/ separately
#                    (the FTL for Keycloak's /welcome endpoint)
#   HAS_THEME_DIR  = y/n — whether dist_keycloak/theme/<INTERNAL>/ exists with
#                    extra sub-dirs to copy as files (not packaged in JAR)
#   EXTRA_TYPE     = "exploded" (per-dir copy) or "login-only" (just the login
#                    FTL/resources, used by vegeta welcome which lives outside JAR)
declare -A THEME_REGISTRY=(
  [superhero]="k2m-theme-superhero:k2m-theme-superhero:n:y:exploded"
  [morph]="k2m-theme-morph:keytomarvel-com-theme:n:y:exploded"
  [vegeta]="k2m-theme-vegeta:k2m-theme-vegeta:y:n:welcome"
  [flowdesk]="k2m-theme-flowdesk:k2m-theme-flowdesk:n:n:login-only"
  [chroniq]="k2m-theme-chroniq:k2m-theme-chroniq:n:n:login-only"
  [catobigato]="k2m-theme-catobigato:k2m-theme-catobigato:n:n:login-only"
  [whereq.com]="k2m-theme-whereq-com:k2m-theme-whereq-com:n:n:login-only"
  [whereq.cc]="k2m-theme-whereq-cc:k2m-theme-whereq-cc:n:n:login-only"
  [qhaul.ca]="k2m-theme-qhaul-ca:k2m-theme-qhaul-ca:n:n:login-only"
)

# Realm-to-theme assignments: which realms use which theme for which columns.
# This is the source of truth. --status will warn about any realm in the DB
# that isn't listed here (orphan). Add new realms here as they're created.
#
# Format: REALM_NAME -> login:account:admin:email
# Use a single dash (-) for "leave whatever's in DB alone".
declare -A REALM_THEME_MAP=(
  [master]="k2m-theme-vegeta:k2m-theme-vegeta:k2m-theme-vegeta:k2m-theme-vegeta"
  [whereq]="k2m-theme-vegeta:k2m-theme-vegeta:k2m-theme-vegeta:k2m-theme-vegeta"
  [catobigato]="k2m-theme-catobigato:k2m-theme-catobigato:k2m-theme-catobigato:k2m-theme-vegeta"
  [flowdesk.top]="k2m-theme-flowdesk:k2m-theme-vegeta:k2m-theme-vegeta:k2m-theme-vegeta"
  [whereq.com]="k2m-theme-whereq-com:k2m-theme-vegeta:k2m-theme-vegeta:k2m-theme-vegeta"
  [chroniq.cc]="k2m-theme-chroniq:k2m-theme-vegeta:k2m-theme-vegeta:k2m-theme-vegeta"
  [whereq.cc-realm]="k2m-theme-whereq-cc:k2m-theme-vegeta:k2m-theme-vegeta:k2m-theme-vegeta"
  [caijing.today-realm]="k2m-theme-vegeta:k2m-theme-vegeta:k2m-theme-vegeta:k2m-theme-vegeta"
  # whereq.cloud left intentionally un-mapped (no theme assigned in PROD)
)

# ── Default container / path names (overridable via env) ──────────────────────
KC_CONTAINER="${K2M_KC_CONTAINER:-keycloak-k2m}"
DB_CONTAINER="${K2M_DB_CONTAINER:-whereq-db}"
DB_NAME="k2m"
DB_USER="whereq"

# Build output JAR — keycloakify produces this same filename for every theme
# under <theme>/dist_keycloak/. On deploy it is renamed to <INTERNAL_NAME>.jar
# so each theme lives in its own provider JAR in PROD (they never overwrite).
JAR_FILENAME="keycloak-theme-for-kc-all-other-versions.jar"
JAR_KC22_FILENAME="keycloak-theme-for-kc-22-to-25.jar"

# Default repo path on PROD (we use a fixed absolute path; $HOME on the local
# box may not match $HOME on PROD)
PROD_REPO_DIR_DEFAULT="/home/whereq/git/KeyToMarvel.com-theme"

# Resilient `yarn` invocation for the remote shell: a bare `ssh host "yarn ..."`
# runs a non-interactive, non-login shell that may not have a standalone `yarn`
# binary on PATH — only `corepack yarn` is guaranteed there. Prefix remote
# build commands with this to resolve the right one at remote-execution time.
YARN_SHIM='if command -v yarn >/dev/null 2>&1; then YARN=yarn; else YARN="corepack yarn"; fi'

# Keycloak health check — the official keycloak image doesn't ship curl, only
# wget, so try curl first (in case that ever changes) and fall back to wget.
KC_HEALTH_CHECK_CMD="curl -sf http://localhost:8080/health/ready >/dev/null 2>&1 || wget -q -O /dev/null http://localhost:8080/health/ready >/dev/null 2>&1"

# ── Runtime state ─────────────────────────────────────────────────────────────
SSH_TARGET=""
THEME_ALIAS=""
SKIP_BUILD=false
SKIP_PULL=false
DRY_RUN=false
DB_ONLY=false
STATUS_ONLY=false
VERIFY_ONLY=false
NO_RESTART=false
PURGE_CLIENT_OVERRIDES=false
ALL_THEMES=false
LOCAL_RUN=false
SSH_TARGET_OVERRIDE=""
KC_HEALTH_TIMEOUT=90   # seconds; 30 × 2s retries

# ── Helper: parse theme registry entry ────────────────────────────────────────
parse_theme() {
    local entry="${THEME_REGISTRY[$1]:-}"
    if [[ -z "$entry" ]]; then
        error "Unknown theme alias: $1"
        return 1
    fi
    IFS=':' read -r THEME_DIR THEME_INTERNAL HAS_WELCOME HAS_THEME_DIR EXTRA_TYPE <<< "$entry"
}

# ── Helper: list themes ──────────────────────────────────────────────────────
list_themes() {
    header "Available themes:"
    echo ""
    printf "  ${BOLD}%-14s %-28s %-22s %-10s %-10s${RESET}\n" "ALIAS" "DIRECTORY" "INTERNAL NAME" "WELCOME" "EXTRA"
    echo "  ────────────────────────────────────────────────────────────────────────────────────"
    for alias in superhero morph vegeta flowdesk chroniq catobigato whereq.com whereq.cc qhaul.ca; do
        if parse_theme "$alias" 2>/dev/null; then
            printf "  %-14s %-28s %-22s %-10s %-10s\n" "$alias" "$THEME_DIR" "$THEME_INTERNAL" "$HAS_WELCOME" "$EXTRA_TYPE"
        fi
    done
    echo ""
    echo "  Realms in REALM_THEME_MAP: ${#REALM_THEME_MAP[@]}"
    echo "  All known theme aliases:   ${!THEME_REGISTRY[*]}"
    echo ""
}

# ── Helper: check if a command exists on the PROD host ───────────────────────
ssh_q() {
    if $LOCAL_RUN; then
        "$@"
    else
        ssh -o ConnectTimeout=10 -o BatchMode=yes "$SSH_TARGET" "$@"
    fi
}

# ── Helper: run SQL on the Keycloak DB ────────────────────────────────────────
run_sql() {
    if $LOCAL_RUN; then
        docker exec "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" -t -A -c "$1" 2>/dev/null
    else
        ssh -o ConnectTimeout=10 -o BatchMode=yes "$SSH_TARGET" \
            "docker exec $DB_CONTAINER psql -U $DB_USER -d $DB_NAME -t -A -c $(printf %q "$1")" 2>/dev/null
    fi
}

# ── Helper: a single remote shell line (prints the line too if dry-run) ──────
remote() {
    if $DRY_RUN; then
        dim "[remote] $*"
        return 0
    fi
    if $LOCAL_RUN; then
        bash -c "$*"
    else
        ssh -o ConnectTimeout=10 -o BatchMode=yes "$SSH_TARGET" "$@"
    fi
}

# ── SSH target auto-detection ─────────────────────────────────────────────────
detect_ssh_target() {
    if [[ -n "$SSH_TARGET_OVERRIDE" ]]; then
        SSH_TARGET="$SSH_TARGET_OVERRIDE"
        info "Using override SSH target: ${BOLD}$SSH_TARGET${RESET}"
        return 0
    fi

    if [[ -n "${K2M_SSH_TARGET:-}" ]]; then
        SSH_TARGET="$K2M_SSH_TARGET"
        info "Using K2M_SSH_TARGET: ${BOLD}$SSH_TARGET${RESET}"
        return 0
    fi

    info "Auto-detecting PROD SSH target (LAN first, then cloudflared)..."

    if ssh -o ConnectTimeout=6 -o BatchMode=yes whereq@whereq 'echo ok' &>/dev/null; then
        SSH_TARGET="whereq@whereq"
        success "LAN reachable → $SSH_TARGET"
        return 0
    fi

    # Try cloudflared tunnel
    if ssh -o ConnectTimeout=15 -o BatchMode=yes ssh.whereq.cc 'echo ok' &>/dev/null; then
        SSH_TARGET="ssh.whereq.cc"
        success "Cloudflared reachable → $SSH_TARGET"
        return 0
    fi

    error "Cannot reach PROD via LAN (whereq@whereq) OR cloudflared (ssh.whereq.cc)."
    error "Pass --target <user@host>, --local, or set K2M_SSH_TARGET."
    return 1
}

# ── Confirm we're on PROD (or have remote access) ────────────────────────────
ensure_on_prod() {
    if $LOCAL_RUN; then
        info "Running in LOCAL mode (assuming you are on PROD)"
        return 0
    fi

    info "Verifying PROD access via ${SSH_TARGET}..."
    if ! ssh -o ConnectTimeout=10 -o BatchMode=yes "$SSH_TARGET" 'echo "hello from $(hostname)"' 2>/dev/null; then
        error "Cannot SSH to $SSH_TARGET"
        return 1
    fi
    success "PROD reachable"
}

# ── Argument parsing ──────────────────────────────────────────────────────────
for arg in "$@"; do
    case "$arg" in
        --skip-build)           SKIP_BUILD=true ;;
        --skip-pull)            SKIP_PULL=true ;;
        --dry-run)              DRY_RUN=true ;;
        --db-only)              DB_ONLY=true ;;
        --status)               STATUS_ONLY=true ;;
        --verify)               VERIFY_ONLY=true ;;
        --no-restart)           NO_RESTART=true ;;
        --purge-client-overrides) PURGE_CLIENT_OVERRIDES=true ;;
        --all)                  ALL_THEMES=true ;;
        --local)                LOCAL_RUN=true ;;
        --target)
            # value comes as next arg — handled after loop
            ;;
        --target=*)
            SSH_TARGET_OVERRIDE="${arg#--target=}"
            ;;
        --list)                 list_themes; exit 0 ;;
        --help|-h)
            sed -n '/^# Usage/,/^set -euo pipefail/p' "$0" \
              | sed -e 's/^# \?//' -e '$d' -e '/^=====/d'
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
            fi
            ;;
    esac
done

# Handle --target <value> (needs separate arg)
i=1
new_args=()
for arg in "$@"; do
    if [[ "$arg" == "--target" ]]; then
        # next arg is the value
        next_idx=$((i + 1))
        next_arg="${!next_idx:-}"
        if [[ -z "$next_arg" ]]; then
            error "--target requires a value (e.g. --target whereq@whereq)"
            exit 1
        fi
        SSH_TARGET_OVERRIDE="$next_arg"
    fi
    i=$((i + 1))
done

# Validate
if ! $ALL_THEMES && ! $STATUS_ONLY && ! $VERIFY_ONLY && ! $DB_ONLY && [[ -z "$THEME_ALIAS" ]]; then
    # Special case: --status alone is fine, --all alone is fine
    if [[ -z "${THEME_ALIAS}${STATUS_ONLY}${VERIFY_ONLY}${DB_ONLY}${ALL_THEMES}" ]]; then
        error "No theme specified. Use --list to see available themes."
        echo "  Usage: $0 <theme> [options]"
        echo "         $0 --all"
        echo "         $0 --status"
        exit 1
    fi
fi

if ! $LOCAL_RUN && [[ -z "$SSH_TARGET" ]]; then
    detect_ssh_target || exit 1
fi

# ── Banner ────────────────────────────────────────────────────────────────────
echo -e "${BOLD}${CYAN}"
echo "  ██╗  ██╗██████╗ ███╗   ███╗"
echo "  ██║ ██╔╝╚════██╗████╗ ████║"
echo "  █████╔╝  █████╔╝██╔████╔██║"
echo "  ██╔═██╗  ╚═══██╗██║╚██╔╝██║"
echo "  ██║  ██╗██████╔╝██║ ╚═╝ ██║"
echo "  ╚═╝  ╚═╝╚═════╝ ╚═╝     ╚═╝  Theme Deployer"
echo -e "${RESET}"

if $ALL_THEMES; then
    info "Mode:     ${BOLD}--all (deploy every theme in sequence)${RESET}"
elif $STATUS_ONLY; then
    info "Mode:     ${BOLD}--status (audit only)${RESET}"
elif $VERIFY_ONLY; then
    info "Mode:     ${BOLD}--verify (audit + exit 1 on drift)${RESET}"
elif $DB_ONLY; then
    info "Mode:     ${BOLD}--db-only (DB theme assignments only)${RESET}"
else
    if [[ -n "$THEME_ALIAS" ]]; then
        parse_theme "$THEME_ALIAS"
        info "Theme:    ${BOLD}$THEME_ALIAS${RESET}  ($THEME_DIR)"
        info "Internal: $THEME_INTERNAL"
        info "Welcome:  $HAS_WELCOME  |  Extra: $EXTRA_TYPE"
    fi
fi

if [[ -n "$SSH_TARGET" ]]; then
    info "Target:   ${BOLD}$SSH_TARGET${RESET}"
fi
$DRY_RUN && warn "DRY RUN — no changes will be made"
echo ""

# ── On-PROD repo path resolution ─────────────────────────────────────────────
PROD_REPO_DIR="${K2M_REPO_DIR:-$PROD_REPO_DIR_DEFAULT}"

# ── Helpers that need parsed THEME_* variables ───────────────────────────────
abs_path() {
    # Join relative path with PROD_REPO_DIR (handles local vs remote)
    if $LOCAL_RUN; then
        echo "$PROD_REPO_DIR/$1"
    else
        echo "$PROD_REPO_DIR/$1"
    fi
}

# ── Status / verify: read-only audit ──────────────────────────────────────────
do_status() {
    header "[ status ] PROD audit"

    # 1. Theme JARs on disk
    echo ""
    info "1) Theme JARs in providers/"
    printf "    ${BOLD}%-14s %-10s %-10s %s${RESET}\n" "ALIAS" "JAR_OK" "AGE_DAYS" "PATH"
    echo "    ───────────────────────────────────────────────────────────────────────────"
    for alias in "${!THEME_REGISTRY[@]}"; do
        parse_theme "$alias"
        local jar_rel="docker/volumes/keycloak/providers/${THEME_INTERNAL}.jar"
        local jar_abs
        jar_abs=$(remote "test -f '$PROD_REPO_DIR/../KeyToMarvel.com/$jar_rel' && echo yes || echo no" 2>/dev/null || echo "no")
        # actually path is on KeyToMarvel.com repo not KeyToMarvel.com-theme
        # Use the docker compose mount: $KEYCLOAK_VOLUMES_DIR
        # We don't know that path ahead of time on PROD; detect it.
        jar_abs=$(remote "find /home/whereq -path '*/keycloak/providers/${THEME_INTERNAL}.jar' 2>/dev/null | head -1" 2>/dev/null || true)
        if [[ -n "$jar_abs" ]]; then
            local jar_info
            jar_info=$(remote "stat -c '%y %s' '$jar_abs' 2>/dev/null" 2>/dev/null || echo "")
            local age days
            if [[ -n "$jar_info" ]]; then
                local mtime_epoch
                mtime_epoch=$(date -d "$(echo "$jar_info" | awk '{print $1, $2}')" +%s 2>/dev/null || echo 0)
                local now
                now=$(date +%s)
                days=$(( (now - mtime_epoch) / 86400 ))
                age="${days}d"
            else
                age="?"
            fi
            printf "    %-14s ${GREEN}%-10s${RESET} %-10s %s\n" "$alias" "yes" "$age" "$jar_abs"
        else
            printf "    %-14s ${RED}%-10s${RESET} %-10s %s\n" "$alias" "NO" "—" "<not deployed>"
        fi
    done

    # 2. Theme dirs in themes/
    echo ""
    info "2) Theme directories in themes/"
    remote "find /home/whereq -path '*/keycloak/themes/*' -maxdepth 5 -type d 2>/dev/null | sort" 2>/dev/null | head -20

    # 3. Containers
    echo ""
    info "3) Docker containers"
    remote "docker ps --format '    {{.Names}}\t{{.Status}}\t{{.Image}}' 2>/dev/null | grep -E '$KC_CONTAINER|$DB_CONTAINER|^    keycloak|^    whereq-db'" 2>/dev/null || echo "    (none found)"

    # 4. Realm DB rows vs REALM_THEME_MAP
    echo ""
    info "4) Realm theme assignments (DB vs REALM_THEME_MAP)"
    printf "    ${BOLD}%-22s %-22s %-22s %-22s %-22s${RESET}\n" "REALM" "LOGIN" "ACCOUNT" "ADMIN" "EMAIL"
    echo "    ──────────────────────────────────────────────────────────────────────────────────────────────────────"
    for realm_name in "${!REALM_THEME_MAP[@]}"; do
        IFS=':' read -r expected_login expected_account expected_admin expected_email <<< "${REALM_THEME_MAP[$realm_name]}"
        ROW=$(run_sql "SELECT login_theme, account_theme, admin_theme, email_theme FROM realm WHERE name='$realm_name';")
        if [[ -z "$ROW" ]]; then
            printf "    ${YELLOW}%-22s${RESET} ${YELLOW}%-22s${RESET}\n" "$realm_name" "(NOT IN DB)"
            continue
        fi
        IFS='|' read -r actual_login actual_account actual_admin actual_email <<< "$ROW"
        local marker_login marker_account marker_admin marker_email
        [[ "$actual_login" == "$expected_login" ]] && marker_login="" || marker_login=" ${RED}✗${RESET}"
        [[ "$actual_account" == "$expected_account" ]] && marker_account="" || marker_account=" ${RED}✗${RESET}"
        [[ "$actual_admin" == "$expected_admin" ]] && marker_admin="" || marker_admin=" ${RED}✗${RESET}"
        [[ "$actual_email" == "$expected_email" ]] && marker_email="" || marker_email=" ${RED}✗${RESET}"
        printf "    %-22s %-22s%-3s %-22s%-3s %-22s%-3s %-22s%-3s\n" \
            "$realm_name" "$actual_login" "$marker_login" \
            "$actual_account" "$marker_account" \
            "$actual_admin" "$marker_admin" \
            "$actual_email" "$marker_email"
    done

    # 5. Orphan realms (in DB but not in REALM_THEME_MAP)
    echo ""
    info "5) Orphan realms (in DB but not in REALM_THEME_MAP)"
    local orphans
    orphans=$(run_sql "SELECT name FROM realm ORDER BY name;" | while read -r name; do
        if [[ -z "${REALM_THEME_MAP[$name]+x}" ]]; then
            echo "$name"
        fi
    done)
    if [[ -z "$orphans" ]]; then
        success "No orphan realms"
    else
        echo "$orphans" | while read -r name; do
            warn "Orphan: $name (consider adding to REALM_THEME_MAP in bin/deploy.sh)"
        done
    fi

    # 6. Client-level theme overrides (informational)
    echo ""
    info "6) Client-level theme overrides (informational)"
    local ca
    ca=$(run_sql "SELECT r.name, c.client_id, ca.value FROM client c JOIN client_attributes ca ON ca.client_id=c.id JOIN realm r ON r.id=c.realm_id WHERE ca.name='login_theme' ORDER BY r.name;" 2>/dev/null || true)
    if [[ -z "$ca" ]]; then
        success "No client-level login_theme overrides"
    else
        echo "$ca" | while IFS='|' read -r realm client value; do
            dim "$realm / $client → $value"
        done
        warn "Client overrides shadow realm setting. Run with --purge-client-overrides to clear."
    fi
}

# ── Run status / verify and exit ─────────────────────────────────────────────
if $STATUS_ONLY; then
    do_status
    echo ""
    success "Status audit complete (no changes made)."
    exit 0
fi

if $VERIFY_ONLY; then
    # Capture status output, then decide based on hard-drift signals only
    verify_out=$(mktemp)
    do_status > "$verify_out" 2>&1
    cat "$verify_out"
    drift=0
    # Drift signals (NOT informational warnings):
    #   - JAR missing from providers dir  (line: <alias>  NO  ... <not deployed>)
    #   - DB theme row doesn't match REALM_THEME_MAP (line with trailing ✗)
    #   - Realm in map but not in DB      (line: NOT IN DB)
    # We strip ANSI escapes first to make regex matching reliable.
    if sed -E 's/\x1b\[[0-9;]*[a-zA-Z]//g' "$verify_out" | grep -qE 'NO[[:space:]]+—'; then
        drift=1
    fi
    if grep -qE '✗' "$verify_out"; then
        drift=1
    fi
    if grep -qE 'NOT IN DB' "$verify_out"; then
        drift=1
    fi
    rm -f "$verify_out"
    echo ""
    if [[ $drift -ne 0 ]]; then
        error "Drift detected — see ✗ marks and 'NO' JAR rows above"
        exit 1
    fi
    success "All theme assignments verified — no drift."
    # Orphan realms + client overrides are informational only
    exit 0
fi

# ── Validation if we have a single theme ─────────────────────────────────────
if ! $ALL_THEMES && ! $DB_ONLY; then
    if [[ -z "${THEME_REGISTRY[$THEME_ALIAS]+x}" ]]; then
        error "Unknown theme: $THEME_ALIAS"
        echo "  Available: ${!THEME_REGISTRY[*]}"
        exit 1
    fi
    parse_theme "$THEME_ALIAS"
fi

# ── Single-theme deploy function (also used by --all) ─────────────────────────
deploy_one_theme() {
    local alias="$1"
    local SKIP_BUILD_LOCAL="$SKIP_BUILD"
    local SKIP_PULL_LOCAL="$SKIP_PULL"

    parse_theme "$alias"

    header "━━━ Deploying ${BOLD}${alias}${RESET} (${THEME_DIR}) ━━━"
    info "Internal: $THEME_INTERNAL"

    local THEME_PATH="$PROD_REPO_DIR/$THEME_DIR"

    # Step 1: git pull (in single-theme mode only)
    if ! $DB_ONLY && [[ "$alias" == "${THEME_ALIAS:-}" ]] && ! $ALL_THEMES; then
        header "[ 1/6 ] Git pull (latest from main)"
        if $SKIP_PULL_LOCAL; then
            dim "Skipped (--skip-pull)"
        elif $DRY_RUN; then
            dim "Would run: git pull origin main"
        else
            remote "cd '$PROD_REPO_DIR' && git fetch --prune origin && git checkout main && git pull --ff-only origin main" 2>&1 | sed 's/^/    /'
            success "On main"
        fi
    fi

    # Step 2: build
    if ! $DB_ONLY; then
        header "[ 2/6 ] Build $alias"
        if $SKIP_BUILD_LOCAL; then
            dim "Skipped (--skip-build)"
        elif $DRY_RUN; then
            dim "Would run: cd $THEME_PATH && yarn install && yarn build-keycloak-theme"
        else
            if ! remote "test -d '$THEME_PATH'" 2>/dev/null; then
                error "Theme directory not found on PROD: $THEME_PATH"
                return 1
            fi
            info "Installing dependencies..."
            remote "cd '$THEME_PATH' && $YARN_SHIM && \$YARN install --frozen-lockfile 2>/dev/null || \$YARN install" 2>&1 | tail -10 | sed 's/^/    /' || true
            info "Building keycloak theme..."
            remote "cd '$THEME_PATH' && $YARN_SHIM && \$YARN build-keycloak-theme" 2>&1 | tail -20 | sed 's/^/    /' || true
            success "Build complete"
        fi
        # Verify build artifact
        local jar_src="$THEME_PATH/dist_keycloak/$JAR_FILENAME"
        if ! $DRY_RUN && ! remote "test -f '$jar_src'" 2>/dev/null; then
            error "JAR not found after build: $jar_src"
            return 1
        fi
        # Verify JAR contents match expected theme name (catches stale builds)
        if ! $DRY_RUN; then
            local jar_check
            jar_check=$(remote "unzip -l '$jar_src' 2>/dev/null | grep -c '^.*theme/$THEME_INTERNAL/' || true" 2>/dev/null || echo "0")
            jar_check=$(echo "$jar_check" | tr -d '[:space:]')
            if [[ "${jar_check:-0}" -lt 1 ]]; then
                warn "JAR contents don't contain theme/$THEME_INTERNAL/ — check vite.config.ts themeName!"
                warn "This usually means a stale build or a misconfigured themeName."
            else
                dim "JAR contains theme/$THEME_INTERNAL/ ($jar_check entries) ✓"
            fi
        fi
    fi

    # Step 3: deploy JAR
    if ! $DB_ONLY; then
        header "[ 3/6 ] Deploy JAR → providers"
        local jar_src="$THEME_PATH/dist_keycloak/$JAR_FILENAME"
        # Find PROD providers dir
        local providers_dir
        providers_dir=$(remote "find /home/whereq -path '*/keycloak/providers' -type d 2>/dev/null | head -1" 2>/dev/null || true)
        if [[ -z "$providers_dir" ]]; then
            error "Cannot locate Keycloak providers dir on PROD"
            return 1
        fi
        local jar_dest="$providers_dir/${THEME_INTERNAL}.jar"

        if $DRY_RUN; then
            dim "Would copy: $jar_src → $jar_dest"
        else
            # Backup existing
            if remote "test -f '$jar_dest'" 2>/dev/null; then
                local ts; ts=$(date +%Y%m%d-%H%M%S)-$$
                local backup="$jar_dest.bak.$ts"
                info "Backing up: $(basename "$backup")"
                remote "cp '$jar_dest' '$backup'" 2>&1 | sed 's/^/    /'
                # Keep only last 3 backups
                remote "cd '$providers_dir' && ls -t ${THEME_INTERNAL}.jar.bak.* 2>/dev/null | tail -n +4 | xargs -r rm -f" 2>&1 | sed 's/^/    /' || true
            fi
            remote "cp '$jar_src' '$jar_dest'" 2>&1 | sed 's/^/    /'
            local size; size=$(remote "du -h '$jar_dest' | cut -f1" 2>/dev/null | tr -d '[:space:]')
            success "JAR deployed → $(basename "$jar_dest") ($size)"
        fi
    fi

    # Step 4: deploy welcome + extra dirs
    if ! $DB_ONLY; then
        header "[ 4/6 ] Deploy theme assets"
        local deployed=0

        local themes_dir
        themes_dir=$(remote "dirname '$providers_dir'" 2>/dev/null)
        themes_dir="$themes_dir/themes"

        if [[ "$HAS_WELCOME" == "y" ]]; then
            local welcome_src="$THEME_PATH/src/keycloak-theme/welcome"
            local welcome_dest="$themes_dir/$THEME_INTERNAL/welcome"
            if $DRY_RUN; then
                dim "Would copy welcome: $welcome_src → $welcome_dest"
            else
                if remote "test -d '$welcome_src'" 2>/dev/null; then
                    remote "mkdir -p '$welcome_dest' && cp -r '$welcome_src/.' '$welcome_dest/'" 2>&1 | sed 's/^/    /'
                    local fcnt; fcnt=$(remote "find '$welcome_dest' -type f 2>/dev/null | wc -l" 2>/dev/null | tr -d '[:space:]')
                    success "Welcome deployed (${fcnt:-?} files)"
                    deployed=$((deployed + 1))
                else
                    warn "Welcome source not found: $welcome_src (skipping)"
                fi
            fi
        fi

        if [[ "$HAS_THEME_DIR" == "y" ]]; then
            local extra_src="$THEME_PATH/dist_keycloak/theme/$THEME_INTERNAL"
            local extra_dest="$themes_dir/$THEME_INTERNAL"
            if $DRY_RUN; then
                dim "Would copy theme dirs: $extra_src → $extra_dest"
                remote "ls '$extra_src' 2>/dev/null" 2>&1 | sed 's/^/    /' || true
            else
                if remote "test -d '$extra_src'" 2>/dev/null; then
                    remote "mkdir -p '$extra_dest'" 2>&1 | sed 's/^/    /'
                    local subdirs
                    subdirs=$(remote "ls -1 '$extra_src' 2>/dev/null" 2>/dev/null)
                    while IFS= read -r subdir; do
                        [[ -z "$subdir" ]] && continue
                        remote "mkdir -p '$extra_dest/$subdir' && cp -r '$extra_src/$subdir/.' '$extra_dest/$subdir/'" 2>&1 | sed 's/^/    /'
                        success "Theme dir: $subdir"
                        deployed=$((deployed + 1))
                    done <<< "$subdirs"
                else
                    warn "Theme extra dir not found: $extra_src (skipping)"
                fi
            fi
        fi

        if [[ $deployed -eq 0 ]]; then
            dim "No extra assets for this theme (JAR-only)"
        fi
    fi

    # Step 5: restart Keycloak (single-theme only)
    if ! $DB_ONLY && ! $ALL_THEMES && ! $NO_RESTART; then
        header "[ 5/6 ] Restart Keycloak"
        if $DRY_RUN; then
            dim "Would run: docker restart $KC_CONTAINER"
        else
            info "Restarting $KC_CONTAINER..."
            remote "docker restart '$KC_CONTAINER'" 2>&1 | sed 's/^/    /' || true
            info "Waiting for Keycloak to become ready..."
            local attempts=0 max=$((KC_HEALTH_TIMEOUT / 2))
            while [[ $attempts -lt $max ]]; do
                if remote "docker exec '$KC_CONTAINER' sh -c \"$KC_HEALTH_CHECK_CMD\"" 2>/dev/null; then
                    success "Keycloak is ready"
                    break
                fi
                attempts=$((attempts + 1))
                sleep 2
            done
            if [[ $attempts -ge $max ]]; then
                warn "Health check timed out after ${KC_HEALTH_TIMEOUT}s — server may still be starting"
            fi
        fi
    fi
}

# ── Step 6: Verify DB theme assignments (also done in --all mode at end) ────
do_verify_db() {
    header "[ verify ] DB theme assignments"
    local db_errors=0

    for realm_name in "${!REALM_THEME_MAP[@]}"; do
        IFS=':' read -r expected_login expected_account expected_admin expected_email <<< "${REALM_THEME_MAP[$realm_name]}"
        local row
        row=$(run_sql "SELECT login_theme, account_theme, admin_theme, email_theme FROM realm WHERE name='$realm_name';")
        if [[ -z "$row" ]]; then
            warn "Realm '$realm_name' not found in DB (skipping)"
            continue
        fi
        IFS='|' read -r actual_login actual_account actual_admin actual_email <<< "$row"

        local updates=""
        for col in login account admin email; do
            local expected_var="expected_$col"
            local actual_var="actual_$col"
            local expected="${!expected_var}"
            local actual="${!actual_var}"
            if [[ "$actual" != "$expected" ]]; then
                db_errors=$((db_errors + 1))
                warn "Realm '$realm_name': ${col}_theme = '$actual' (expected '$expected')"
                updates+="${col}_theme='$expected', "
            fi
        done

        if [[ -n "$updates" ]]; then
            updates="${updates%, }"
            if $DRY_RUN; then
                dim "Would run: UPDATE realm SET $updates WHERE name='$realm_name';"
            else
                info "Fixing realm '$realm_name'..."
                run_sql "UPDATE realm SET $updates WHERE name='$realm_name';" >/dev/null
                success "Realm '$realm_name' updated"
            fi
        else
            success "Realm '$realm_name': all theme columns correct"
        fi
    done

    # Client override cleanup (opt-in)
    if $PURGE_CLIENT_OVERRIDES; then
        echo ""
        info "Purging client-level login_theme overrides for managed realms..."
        local purge_count=0
        for realm_name in "${!REALM_THEME_MAP[@]}"; do
            IFS=':' read -r expected_login _ _ _ <<< "${REALM_THEME_MAP[$realm_name]}"
            local affected
            affected=$(run_sql "DELETE FROM client_attributes ca USING client c, realm r WHERE ca.client_id=c.id AND c.realm_id=r.id AND r.name='$realm_name' AND ca.name='login_theme' RETURNING ca.client_id;" 2>/dev/null)
            if [[ -n "$affected" ]]; then
                local cnt; cnt=$(echo "$affected" | wc -l | tr -d '[:space:]')
                warn "Cleared $cnt client-level override(s) for realm '$realm_name'"
                purge_count=$((purge_count + cnt))
            fi
        done
        if [[ $purge_count -eq 0 ]]; then
            success "No client-level overrides found for managed realms"
        else
            success "Purged $purge_count client override(s) total"
        fi
    fi

    # Orphan check (informational)
    echo ""
    info "Checking for orphan realms (in DB but not in REALM_THEME_MAP)..."
    local orphans
    orphans=$(run_sql "SELECT name FROM realm ORDER BY name;" | while read -r name; do
        if [[ -z "${REALM_THEME_MAP[$name]+x}" ]]; then
            echo "$name"
        fi
    done)
    if [[ -n "$orphans" ]]; then
        echo "$orphans" | while read -r name; do
            warn "Orphan: $name (add to REALM_THEME_MAP in bin/deploy.sh)"
        done
    else
        success "No orphan realms"
    fi

    return $db_errors
}

# ── Main flow ────────────────────────────────────────────────────────────────

# Pre-flight (only for non-status modes)
if ! $STATUS_ONLY && ! $VERIFY_ONLY; then
    header "[ 0/6 ] Preflight checks"
    if ! $LOCAL_RUN && ! $DB_ONLY; then
        ensure_on_prod || exit 1
    fi
    # Check containers
    if ! $DB_ONLY; then
        if ! remote "docker ps --format '{{.Names}}' | grep -q '^${KC_CONTAINER}$'" 2>/dev/null; then
            error "Keycloak container '$KC_CONTAINER' is not running on PROD"
            exit 1
        fi
        success "Keycloak container running"
    fi
    if ! remote "docker ps --format '{{.Names}}' | grep -q '^${DB_CONTAINER}$'" 2>/dev/null; then
        error "Database container '$DB_CONTAINER' is not running on PROD"
        exit 1
    fi
    success "Database container running"
    if ! $DB_ONLY; then
        # Providers dir
        pdir=$(remote "find /home/whereq -path '*/keycloak/providers' -type d 2>/dev/null | head -1" 2>/dev/null || true)
        if [[ -z "$pdir" ]]; then
            error "Cannot locate Keycloak providers dir on PROD"
            exit 1
        fi
        success "Providers dir: $pdir"
    fi
fi

if $ALL_THEMES; then
    # Deploy every theme in sequence (skip-pull after first, skip-build if requested)
    info "Deploying all themes in: ${!THEME_REGISTRY[*]}"
    echo ""
    first=true
    for alias in superhero morph vegeta flowdesk chroniq catobigato whereq.com whereq.cc qhaul.ca; do
        if [[ "$first" == true ]]; then
            SKIP_PULL=false  # first one pulls
            first=false
        else
            SKIP_PULL=true   # rest don't pull again
        fi
        deploy_one_theme "$alias" || warn "Failed to deploy $alias — continuing"
        echo ""
    done

    # Restart Keycloak ONCE at the end
    if ! $DRY_RUN && ! $NO_RESTART; then
        header "[ restart ] Restarting Keycloak after all themes"
        remote "docker restart '$KC_CONTAINER'" 2>&1 | sed 's/^/    /' || true
        info "Waiting for Keycloak to become ready..."
        local attempts=0 max=$((KC_HEALTH_TIMEOUT / 2))
        while [[ $attempts -lt $max ]]; do
            if remote "docker exec '$KC_CONTAINER' sh -c \"$KC_HEALTH_CHECK_CMD\"" 2>/dev/null; then
                success "Keycloak is ready"
                break
            fi
            attempts=$((attempts + 1))
            sleep 2
        done
        if [[ $attempts -ge $max ]]; then
            warn "Health check timed out after ${KC_HEALTH_TIMEOUT}s"
        fi
    fi
elif $DB_ONLY; then
    :
else
    deploy_one_theme "$THEME_ALIAS"
fi

# Always verify DB at the end (unless --status / --verify which already do their own audit)
if ! $STATUS_ONLY && ! $VERIFY_ONLY; then
    do_verify_db
fi

# ── Summary ───────────────────────────────────────────────────────────────────
echo ""
if $DRY_RUN; then
    success "${BOLD}Dry run complete — no changes made.${RESET}"
else
    success "${BOLD}Deployment complete.${RESET}"
fi
echo ""
info "Tip: run 'bin/deploy.sh --status' any time to audit PROD state."
echo ""