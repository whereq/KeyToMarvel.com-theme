#!/usr/bin/env bash
# build-and-deploy.sh — Build the JAR then deploy all artifacts to Keycloak volumes
#
# Run this on a machine with Node.js/Yarn (e.g., WSL local dev).
# On Raspberry Pi (no build toolchain needed), use deploy.sh with the pre-built JAR.
#
# Usage:
#   ./bin/build-and-deploy.sh [KEYCLOAK_VOLUMES_DIR]
#
# Default KEYCLOAK_VOLUMES_DIR (relative to this project):
#   ../../KeyToMarvel.com/docker/volumes/keycloak

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

KC_VOLUMES_DIR="${1:-$PROJECT_DIR/../../KeyToMarvel.com/docker/volumes/keycloak}"

echo "======================================="
echo " k2m-theme-vegeta build + deploy"
echo "======================================="
echo " Project : $PROJECT_DIR"
echo ""

# ── Build ─────────────────────────────────────────────────────────────────────
echo "[1/2] Building Keycloak theme JAR..."
cd "$PROJECT_DIR"
yarn build-keycloak-theme
echo "      Done."
echo ""

# ── Deploy ────────────────────────────────────────────────────────────────────
echo "[2/2] Running deploy.sh..."
"$SCRIPT_DIR/deploy.sh" "$KC_VOLUMES_DIR"
