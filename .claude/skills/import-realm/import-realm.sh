#!/usr/bin/env bash
# import-realm.sh — Import a Keycloak realm from a realm-representation JSON,
#                   idempotently, WITHOUT restarting the shared Keycloak.
#
# Drives `kcadm.sh` inside the running Keycloak container via `docker exec`, so it
# never restarts the server (all other realms/apps stay up). New realm → uses
# `create realms`; existing realm → uses `partialImport` (OVERWRITE) so re-runs
# are safe.
#
# Runs on the host that owns the Keycloak container (PROD: reach it first, e.g.
# `ssh whereq@whereq`). Requires on host: docker (+ python3 for JSON checks).
#
# AUTH — three ways to provide the master admin password (pick one):
#   1) flag:     --password 'secret'
#   2) env:      KC_ADMIN_PASSWORD='secret' ./import-realm.sh realm.json
#   3) runtime:  (omit both) → the script securely prompts (read -s), no echo
#   …or reuse an existing kcadm session in the container with --use-session.
#
# Usage:
#   ./import-realm.sh <realm.json> [options]
#
# Options:
#   --container <name>      Keycloak container   (default: keycloak-k2m; env KC_CONTAINER)
#   --server <url>          in-container base URL (default: http://localhost:8080)
#   --admin-realm <realm>   admin realm          (default: master)
#   --admin-user <user>     admin username       (default: whereq-admin; env KC_ADMIN_USER)
#   --password <pw>         admin password       (else env KC_ADMIN_PASSWORD, else prompt)
#   --use-session           reuse an existing kcadm session; skip credential login
#   --on-exists <mode>      realm already exists: overwrite | skip | fail (default: overwrite)
#   --regen-secret <id>     after import, regenerate a confidential client's secret and print it
#   --dry-run               print every action; change nothing
#   -h, --help
#
# Examples:
#   ./import-realm.sh chroniq.cc-realm.json                       # prompts for password
#   KC_ADMIN_PASSWORD=… ./import-realm.sh chroniq.cc-realm.json   # non-interactive
#   ./import-realm.sh chroniq.cc-realm.json --container docker-keycloak-1   # WSL local
#   ./import-realm.sh chroniq.cc-realm.json --dry-run
#   ./import-realm.sh chroniq.cc-realm.json --regen-secret chroniq-backend
#
# ⚠️ Do NOT use `kc.sh bootstrap-admin` or `--import-realm` on a running shared
#    instance: bootstrap-admin binds the management port (9000) the live server
#    already holds and fails; --import-realm only runs at boot (needs a restart,
#    interrupting every realm). This script avoids both.
set -euo pipefail

# ─── Colours ────────────────────────────────────────────────────────────────
if [[ -t 1 ]]; then
  RED=$'\033[0;31m'; GRN=$'\033[0;32m'; YLW=$'\033[1;33m'; CYN=$'\033[0;36m'; DIM=$'\033[2m'; NC=$'\033[0m'
else
  RED=; GRN=; YLW=; CYN=; DIM=; NC=
fi
info() { echo "${CYN}▶${NC} $*"; }
ok()   { echo "${GRN}✔${NC} $*"; }
warn() { echo "${YLW}⚠${NC}  $*"; }
err()  { echo "${RED}✖${NC} $*" >&2; }

# ─── Defaults ───────────────────────────────────────────────────────────────
CONTAINER="${KC_CONTAINER:-keycloak-k2m}"
SERVER="${KC_INTERNAL_URL:-http://localhost:8080}"
ADMIN_REALM="master"
ADMIN_USER="${KC_ADMIN_USER:-whereq-admin}"
PASSWORD="${KC_ADMIN_PASSWORD:-}"
USE_SESSION=false
ON_EXISTS="overwrite"
REGEN_SECRET=""
DRY_RUN=false
REALM_FILE=""

usage() { sed -n '2,52p' "$0" | sed 's/^# \{0,1\}//'; exit "${1:-0}"; }

# ─── Parse args ─────────────────────────────────────────────────────────────
while [[ $# -gt 0 ]]; do
  case "$1" in
    --container)    CONTAINER="$2"; shift 2 ;;
    --server)       SERVER="$2"; shift 2 ;;
    --admin-realm)  ADMIN_REALM="$2"; shift 2 ;;
    --admin-user)   ADMIN_USER="$2"; shift 2 ;;
    --password)     PASSWORD="$2"; shift 2 ;;
    --use-session)  USE_SESSION=true; shift ;;
    --on-exists)    ON_EXISTS="$2"; shift 2 ;;
    --regen-secret) REGEN_SECRET="$2"; shift 2 ;;
    --dry-run)      DRY_RUN=true; shift ;;
    -h|--help)      usage 0 ;;
    -*)             err "Unknown option: $1"; usage 2 ;;
    *)              REALM_FILE="$1"; shift ;;
  esac
done

[[ -n "$REALM_FILE" ]] || { err "missing <realm.json>"; usage 2; }
[[ -f "$REALM_FILE" ]] || { err "file not found: $REALM_FILE"; exit 2; }
case "$ON_EXISTS" in overwrite|skip|fail) ;; *) err "--on-exists must be overwrite|skip|fail"; exit 2 ;; esac

# ─── Validate JSON + extract realm name ──────────────────────────────────────
if command -v python3 >/dev/null 2>&1; then
  REALM_NAME="$(python3 -c 'import json,sys; print(json.load(open(sys.argv[1]))["realm"])' "$REALM_FILE")" \
    || { err "invalid JSON or missing top-level \"realm\" key: $REALM_FILE"; exit 2; }
else
  REALM_NAME="$(grep -oE '"realm"[[:space:]]*:[[:space:]]*"[^"]+"' "$REALM_FILE" | head -1 | sed -E 's/.*"realm"[^"]*"([^"]+)".*/\1/')"
  [[ -n "$REALM_NAME" ]] || { err "could not read \"realm\" from $REALM_FILE"; exit 2; }
fi

BASENAME="$(basename "$REALM_FILE")"
REMOTE_PATH="/tmp/${BASENAME}"
KCADM="/opt/keycloak/bin/kcadm.sh"

info "Import realm ${CYN}${REALM_NAME}${NC} into container ${CYN}${CONTAINER}${NC} (server ${SERVER})"
echo "${DIM}  file: ${REALM_FILE}  |  on-exists: ${ON_EXISTS}  |  dry-run: ${DRY_RUN}${NC}"

# ─── Preflight ──────────────────────────────────────────────────────────────
if ! docker inspect "$CONTAINER" >/dev/null 2>&1; then
  err "container '${CONTAINER}' not found (running on the right host? try --container docker-keycloak-1 on WSL)"
  exit 1
fi

# ─── Authenticate kcadm (unless reusing a session) ───────────────────────────
if [[ "$USE_SESSION" == true ]]; then
  info "Reusing existing kcadm session in the container (skipping login)"
else
  if [[ -z "$PASSWORD" ]]; then
    read -rs -p "Password for ${ADMIN_USER}@${ADMIN_REALM}: " PASSWORD; echo
  fi
  [[ -n "$PASSWORD" ]] || { err "no password provided"; exit 2; }
  info "Authenticating kcadm as ${ADMIN_USER} (realm ${ADMIN_REALM})"
  if [[ "$DRY_RUN" == true ]]; then
    echo "${DIM}  [dry-run] docker exec -e KC_PW $CONTAINER $KCADM config credentials --server $SERVER --realm $ADMIN_REALM --user $ADMIN_USER --password ****${NC}"
  else
    # Pass the password via a forwarded env var (KC_PW), so it never appears in
    # any process argv on host or container.
    export KC_PW="$PASSWORD"
    docker exec -e KC_PW "$CONTAINER" sh -c \
      "$KCADM config credentials --server '$SERVER' --realm '$ADMIN_REALM' --user '$ADMIN_USER' --password \"\$KC_PW\"" \
      || { err "kcadm login failed — check username/password"; exit 1; }
    unset KC_PW
    ok "Authenticated"
  fi
fi

kc() { docker exec "$CONTAINER" $KCADM "$@"; }

# ─── Stage the realm file into the container ─────────────────────────────────
info "Copying ${BASENAME} into ${CONTAINER}:${REMOTE_PATH}"
if [[ "$DRY_RUN" == false ]]; then
  docker cp "$REALM_FILE" "${CONTAINER}:${REMOTE_PATH}"
fi

# ─── Does the realm already exist? ───────────────────────────────────────────
REALM_EXISTS=false
if [[ "$USE_SESSION" == true || "$DRY_RUN" == false ]]; then
  if kc get "realms/${REALM_NAME}" --fields realm >/dev/null 2>&1; then
    REALM_EXISTS=true
  fi
fi

# ─── Import ──────────────────────────────────────────────────────────────────
if [[ "$REALM_EXISTS" == true ]]; then
  case "$ON_EXISTS" in
    fail)
      err "realm '${REALM_NAME}' already exists (use --on-exists overwrite|skip)"; exit 1 ;;
    skip)
      warn "realm '${REALM_NAME}' already exists — skipping import (--on-exists skip)" ;;
    overwrite)
      info "realm '${REALM_NAME}' exists → partialImport (OVERWRITE clients/roles/users)"
      if [[ "$DRY_RUN" == false ]]; then
        kc create partialImport -r "$REALM_NAME" -s ifResourceExists=OVERWRITE -o -f "$REMOTE_PATH" >/dev/null
        ok "partial import applied"
      else
        echo "${DIM}  [dry-run] kcadm create partialImport -r $REALM_NAME -s ifResourceExists=OVERWRITE -o -f $REMOTE_PATH${NC}"
      fi ;;
  esac
else
  info "creating new realm '${REALM_NAME}'"
  if [[ "$DRY_RUN" == false ]]; then
    kc create realms -f "$REMOTE_PATH" >/dev/null
    ok "realm created"
  else
    echo "${DIM}  [dry-run] kcadm create realms -f $REMOTE_PATH${NC}"
  fi
fi

# ─── Optional: regenerate a confidential client secret ───────────────────────
if [[ -n "$REGEN_SECRET" && "$DRY_RUN" == false ]]; then
  info "Regenerating secret for client '${REGEN_SECRET}'"
  CID="$(kc get clients -r "$REALM_NAME" -q clientId="$REGEN_SECRET" --fields id --format csv --noquotes 2>/dev/null | tr -d '\r' | head -1 || true)"
  if [[ -n "$CID" ]]; then
    NEW_SECRET="$(kc create "clients/${CID}/client-secret" -r "$REALM_NAME" 2>/dev/null; kc get "clients/${CID}/client-secret" -r "$REALM_NAME" --fields value --format csv --noquotes 2>/dev/null | tr -d '\r' | head -1)"
    ok "New secret for ${REGEN_SECRET}: ${GRN}${NEW_SECRET}${NC}"
    warn "Put this in the app backend env (e.g. KEYCLOAK_ADMIN_CLIENT_SECRET) and keep it out of git."
  else
    warn "client '${REGEN_SECRET}' not found in realm ${REALM_NAME}"
  fi
fi

# ─── Verify ──────────────────────────────────────────────────────────────────
if [[ "$DRY_RUN" == false && "$ON_EXISTS" != "skip" ]]; then
  echo
  info "Verification"
  kc get "realms/${REALM_NAME}" --fields realm,enabled 2>/dev/null || true
  echo "${DIM}  clients:${NC}"
  kc get clients -r "$REALM_NAME" --fields clientId,publicClient,serviceAccountsEnabled 2>/dev/null || true
  echo "${DIM}  realm roles:${NC}"
  kc get roles -r "$REALM_NAME" --fields name 2>/dev/null || true
fi

# ─── Post-import checklist ───────────────────────────────────────────────────
cat <<EOF

${GRN}Import complete.${NC} Post-import steps:
  1. Regenerate the confidential client secret (if not done via --regen-secret):
       console → Clients → <app>-backend → Credentials → Regenerate → put in backend env.
  2. Verify the service account has realm-management roles (manage-users, view-realm):
       console → Clients → <app>-backend → Service account roles.
  3. Confirm the realm login theme is deployed; else set it to k2m-theme-vegeta temporarily.
  4. SMTP / Google / WeChat / avatar mappers: run the ${CYN}onboard-realm${NC} skill for this realm.
EOF
