#!/usr/bin/env bash
# =============================================================================
# KeyToMarvel.com-theme — Release Script (enhanced)
# =============================================================================
# Stage, commit, optionally squash local commits, merge dev→main if needed,
# tag, and push to origin. Auto-discovers themes under k2m-theme-*/.
#
# Usage:
#   bin/release.sh -m "msg" [OPTIONS]
#
# Required:
#   -m, --message <msg>           Commit / tag message
#
# Options:
#   --tag-message <msg>           Tag annotation (default: same as --message)
#   --no-squash                   Skip squashing commits ahead of origin
#   --no-tag                      Don't create a new tag (commit + push only)
#   --major | --minor | --patch   Bump major/minor/patch explicitly
#   --set-version <vX.Y.Z>        Use an exact version tag (overrides bump)
#   --amend                       Amend the last commit instead of creating a new one
#   --only <dir>[,<dir>...]       Only stage changes under these k2m-theme-* dirs
#                                 (plus root files like bin/, docs/, CLAUDE.md)
#   --ignore-untracked            Don't fail on untracked files; just stage
#                                 modifications + deletions + tracked untracked
#                                 (still warns about new .claude/ dirs)
#   --allow-claude                Allow committing .claude/ dirs (off by default)
#   --no-push                     Commit + tag only; do not push
#   --dry-run                     Print all commands without executing
#   -h, --help                    Show this help message
#
# Tag naming convention:
#   v{major}.{minor}.{patch}      e.g. v0.0.2 → v0.0.3 (default: auto-bump patch)
#   Use --major / --minor / --patch to bump that part.
#   Use --set-version to pin a specific version (must not already exist).
#
# Typical flow:
#   1. Make changes on main (or dev branch) — usually inside k2m-theme-<name>/
#   2. bin/release.sh -m "Add catobigato theme"
#      → stages, commits, squashes, tags v0.0.N, pushes main + tags
#   3. SSH to PROD (or run bin/deploy.sh — see that script for auto-SSH)
#   4. bin/deploy.sh <theme>      # or --all / --status
#
# Examples:
#   bin/release.sh -m "Redesign flowdesk login page"
#   bin/release.sh -m "Bump keycloakify" --minor
#   bin/release.sh -m "Fix vegeta welcome" --only k2m-theme-vegeta
#   bin/release.sh -m "Multi-theme refresh" --only k2m-theme-flowdesk,k2m-theme-chroniq
#   bin/release.sh -m "Add hotfix" --set-version v0.1.0 --no-push
#   bin/release.sh -m "Tweak last commit" --amend --no-tag
#   bin/release.sh -m "Dry run check" --dry-run
# =============================================================================
set -euo pipefail

# ── Colours ───────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; DIM='\033[2m'; NC='\033[0m'

info()    { echo -e "${CYAN}▶${NC} $*"; }
success() { echo -e "${GREEN}✔${NC} $*"; }
warn()    { echo -e "${YELLOW}⚠${NC}  $*"; }
error()   { echo -e "${RED}✖${NC} $*" >&2; }
dim()     { echo -e "${DIM}  $*${NC}"; }

step() {
    STEP=$((STEP + 1))
    echo ""
    echo -e "${BOLD}${CYAN}━━━ Step ${STEP}: $*${NC}"
    STEP_NAMES+=("$*")
}

record_result() { STEP_RESULTS+=("$1"); }

run() {
    if [[ "$DRY_RUN" == true ]]; then
        echo -e "  ${DIM}[dry-run]${NC} ${BOLD}$*${NC}"
    else
        "$@"
    fi
}

elapsed_time() {
    local secs=$(( $(date +%s) - START_TIME ))
    printf '%dm%02ds' $(( secs / 60 )) $(( secs % 60 ))
}

# ── Paths ─────────────────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# ── Defaults ──────────────────────────────────────────────────────────────────
COMMIT_MSG=""
TAG_MSG=""
DO_SQUASH=true
DO_TAG=true
DO_PUSH=true
BUMP_MODE="patch"     # patch | minor | major | none | set
SET_VERSION=""
DRY_RUN=false
MAIN_BRANCH="main"
AMEND=false
ONLY_DIRS=""
ALLOW_CLAUDE=false
STEP=0
START_TIME=$(date +%s)

declare -a STEP_NAMES=()
declare -a STEP_RESULTS=()

# ── Helpers ───────────────────────────────────────────────────────────────────

# Discover theme dirs dynamically (k2m-theme-*)
discover_themes() {
    local dirs=()
    for d in "$PROJECT_ROOT"/k2m-theme-*/; do
        [[ -d "$d" ]] || continue
        dirs+=("$(basename "$d")")
    done
    printf '%s\n' "${dirs[@]}"
}

# Compute next tag based on BUMP_MODE
next_tag() {
    local last
    last=$(git -C "$PROJECT_ROOT" tag --sort=-version:refname \
        | grep -E '^v[0-9]+\.[0-9]+\.[0-9]+$' \
        | head -1 || true)

    if [[ -n "$SET_VERSION" ]]; then
        # Validate
        if ! [[ "$SET_VERSION" =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
            error "Invalid version format: $SET_VERSION (expected vX.Y.Z)"
            exit 1
        fi
        if git -C "$PROJECT_ROOT" rev-parse --verify "refs/tags/$SET_VERSION" &>/dev/null; then
            error "Tag already exists: $SET_VERSION"
            exit 1
        fi
        echo "$SET_VERSION"
        return
    fi

    if [[ -z "$last" ]]; then
        case "$BUMP_MODE" in
            major) echo "v1.0.0" ;;
            minor) echo "v0.1.0" ;;
            patch|"") echo "v0.0.1" ;;
            none) echo "" ;;
        esac
        return
    fi

    if [[ "$BUMP_MODE" == "none" ]]; then
        echo ""
        return
    fi

    local body="${last#v}"
    local major="${body%%.*}"
    local rest="${body#*.}"
    local minor="${rest%%.*}"
    local patch="${rest#*.}"

    case "$BUMP_MODE" in
        major) echo "v$((major + 1)).0.0" ;;
        minor) echo "v${major}.$((minor + 1)).0" ;;
        patch|"") echo "v${major}.${minor}.$((patch + 1))" ;;
    esac
}

# ── Parse arguments ───────────────────────────────────────────────────────────
parse_args() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
            -m|--message)
                [[ -n "${2:-}" ]] || { error "--message requires a value"; exit 1; }
                COMMIT_MSG="$2"; shift 2 ;;
            --tag-message)
                [[ -n "${2:-}" ]] || { error "--tag-message requires a value"; exit 1; }
                TAG_MSG="$2"; shift 2 ;;
            --no-squash)      DO_SQUASH=false; shift ;;
            --no-tag)         DO_TAG=false; BUMP_MODE="none"; shift ;;
            --no-push)        DO_PUSH=false; shift ;;
            --major)          BUMP_MODE="major"; shift ;;
            --minor)          BUMP_MODE="minor"; shift ;;
            --patch)          BUMP_MODE="patch"; shift ;;
            --set-version)
                [[ -n "${2:-}" ]] || { error "--set-version requires a value"; exit 1; }
                SET_VERSION="$2"; BUMP_MODE="set"; shift 2 ;;
            --amend)          AMEND=true; shift ;;
            --only)
                [[ -n "${2:-}" ]] || { error "--only requires a comma-separated dir list"; exit 1; }
                ONLY_DIRS="$2"; shift 2 ;;
            --allow-claude)   ALLOW_CLAUDE=true; shift ;;
            --dry-run)        DRY_RUN=true; shift ;;
            -h|--help)
                # Print usage block: from "# Usage:" line to the line before "set -euo pipefail"
                sed -n '/^# Usage:/,/^set -euo pipefail/p' "$0" \
                  | sed -e 's/^# \?//' -e '$d' -e '/^=====/d'
                exit 0 ;;
            *)
                error "Unknown argument: $1"
                echo "Run 'bin/release.sh --help' for usage."
                exit 1 ;;
        esac
    done

    if [[ -z "$COMMIT_MSG" ]]; then
        error "--message is required."
        echo "Use: bin/release.sh -m \"Your release summary\""
        exit 1
    fi

    [[ -z "$TAG_MSG" ]] && TAG_MSG="$COMMIT_MSG"

    if $AMEND && $DO_SQUASH; then
        warn "--amend implies --no-squash (cannot amend + squash)"
        DO_SQUASH=false
    fi
}

# ── Pre-flight ────────────────────────────────────────────────────────────────
preflight() {
    local tag next_tag_display
    tag=$(next_tag)
    if [[ -n "$tag" ]]; then
        next_tag_display="$tag"
    else
        next_tag_display="(no tag)"
    fi

    if ! git -C "$PROJECT_ROOT" rev-parse --git-dir &>/dev/null; then
        error "Not a git repository: ${PROJECT_ROOT}"
        exit 1
    fi

    CURRENT_BRANCH=$(git -C "$PROJECT_ROOT" rev-parse --abbrev-ref HEAD)
    ON_DEV=false
    if [[ "$CURRENT_BRANCH" != "$MAIN_BRANCH" ]]; then
        ON_DEV=true
        DEV_BRANCH="$CURRENT_BRANCH"
    fi

    # Theme discovery
    mapfile -t DISCOVERED_THEMES < <(discover_themes)
    info "Themes discovered (${#DISCOVERED_THEMES[@]}): ${DISCOVERED_THEMES[*]}"

    info "K2M release — branch: ${BOLD}${CURRENT_BRANCH}${NC} | next tag: ${BOLD}${next_tag_display}${NC}"
    info "Bump mode: $BUMP_MODE | squash: $DO_SQUASH | amend: $AMEND | push: $DO_PUSH | dry-run: $DRY_RUN"
    if [[ -n "$ONLY_DIRS" ]]; then
        info "Only dirs: $ONLY_DIRS"
    fi
    if $ON_DEV; then
        info "Dev branch detected — will merge ${DEV_BRANCH} → ${MAIN_BRANCH}"
    fi
    echo ""

    # Untracked .claude check
    if ! $ALLOW_CLAUDE; then
        local claude_untracked
        claude_untracked=$(git -C "$PROJECT_ROOT" ls-files --others --exclude-standard | grep -E '(^|/)\.claude/' || true)
        if [[ -n "$claude_untracked" ]]; then
            warn "Untracked .claude/ files detected (will NOT be staged unless --allow-claude):"
            echo "$claude_untracked" | sed 's/^/    /'
            dim "Tip: add '.claude/' to .gitignore OR pass --allow-claude"
        fi
    fi

    # Pre-flight: check that origin/main hasn't diverged
    if ! $DRY_RUN && $DO_PUSH; then
        if ! git -C "$PROJECT_ROOT" fetch --quiet origin "$MAIN_BRANCH" 2>/dev/null; then
            warn "Could not fetch origin/$MAIN_BRANCH (network issue?). Push may fail."
        else
            local local_tip remote_tip
            local_tip=$(git -C "$PROJECT_ROOT" rev-parse "$MAIN_BRANCH" 2>/dev/null || echo "")
            remote_tip=$(git -C "$PROJECT_ROOT" rev-parse "origin/$MAIN_BRANCH" 2>/dev/null || echo "")
            if [[ -n "$remote_tip" ]] && [[ -n "$local_tip" ]] && [[ "$local_tip" != "$remote_tip" ]]; then
                warn "origin/$MAIN_BRANCH has moved (${remote_tip:0:7}) vs local (${local_tip:0:7})."
                if $ON_DEV; then
                    dim "Will be reconciled by merge + pull in step."
                else
                    warn "This may cause push rejection. Consider: git pull --rebase origin $MAIN_BRANCH"
                fi
            fi
        fi
    fi
}

# ── Build staging pathspec from --only (if provided) ─────────────────────────
build_pathspec() {
    if [[ -z "$ONLY_DIRS" ]]; then
        # stage everything
        echo "ALL"
        return
    fi
    local spec=""
    IFS=',' read -ra dirs <<< "$ONLY_DIRS"
    for d in "${dirs[@]}"; do
        # accept "k2m-theme-*" or just "<name>"
        if [[ "$d" != k2m-theme-* ]]; then
            d="k2m-theme-$d"
        fi
        if [[ ! -d "$PROJECT_ROOT/$d" ]]; then
            error "Unknown theme directory: $d"
            info "Available: ${DISCOVERED_THEMES[*]}"
            exit 1
        fi
        spec+=" $d"
    done
    echo "$spec"
}

# ── Step: Stage and commit pending changes ────────────────────────────────────
do_stage_and_commit() {
    step "Stage and commit pending changes"

    if [[ "$DRY_RUN" == true ]] && [[ -z "$ONLY_DIRS" ]]; then
        dim "[dry-run] would run: git add -A && git commit -m \"${COMMIT_MSG}\""
        record_result "skip"
        return
    fi

    local spec
    spec=$(build_pathspec)

    local has_changes=false
    if ! git -C "$PROJECT_ROOT" diff --quiet; then has_changes=true; fi
    if ! git -C "$PROJECT_ROOT" diff --cached --quiet; then has_changes=true; fi
    if [[ -n "$(git -C "$PROJECT_ROOT" ls-files --others --exclude-standard)" ]]; then has_changes=true; fi

    if [[ "$has_changes" == false ]]; then
        warn "Working tree already clean — nothing to commit"
        record_result "skip"
        return
    fi

    dim "Staged changes preview:"
    if [[ "$spec" == "ALL" ]]; then
        git -C "$PROJECT_ROOT" status --short | sed 's/^/  /'
    else
        git -C "$PROJECT_ROOT" status --short -- $spec 2>/dev/null | sed 's/^/  /'
    fi
    echo ""

    if [[ "$spec" == "ALL" ]]; then
        if ! $ALLOW_CLAUDE; then
            # Stage everything, then unstage any .claude/ paths using a
            # positive inclusion list (more reliable than negative pathspec)
            git -C "$PROJECT_ROOT" add -A
            # Collect staged .claude/ paths and reset just those
            local claude_paths
            claude_paths=$(git -C "$PROJECT_ROOT" diff --cached --name-only -- '.claude/' '*/.claude/' | tr '\n' ' ')
            if [[ -n "$claude_paths" ]]; then
                # shellcheck disable=SC2086
                git -C "$PROJECT_ROOT" reset -q -- $claude_paths
                dim "Excluded $(echo "$claude_paths" | wc -w) .claude/ path(s) from staging (use --allow-claude to include)"
            fi
        else
            git -C "$PROJECT_ROOT" add -A
        fi
    else
        # Stage only the listed dirs (and their contents)
        for d in $spec; do
            git -C "$PROJECT_ROOT" add -A -- "$d"
        done
    fi

    if $AMEND; then
        run git -C "$PROJECT_ROOT" commit --amend --no-edit -m "$COMMIT_MSG"
    else
        run git -C "$PROJECT_ROOT" commit -m "$COMMIT_MSG"
    fi

    local new_sha
    new_sha=$(git -C "$PROJECT_ROOT" log -1 --oneline)
    success "Committed → ${new_sha}"
    record_result "ok"
}

# ── Step: Squash commits ─────────────────────────────────────────────────────
do_squash() {
    if [[ "$DO_SQUASH" == false ]]; then
        if $AMEND; then
            warn "Skipping squash (--amend)"
        else
            warn "Skipping squash (--no-squash)"
        fi
        record_result "skip"
        return
    fi

    step "Squash local commits into one"

    if [[ "$DRY_RUN" == true ]]; then
        dim "[dry-run] would compute commits ahead of origin and squash"
        record_result "skip"
        return
    fi

    local remote_ref="origin/${CURRENT_BRANCH}"
    local commit_count

    if git -C "$PROJECT_ROOT" rev-parse --verify "$remote_ref" &>/dev/null; then
        commit_count=$(git -C "$PROJECT_ROOT" rev-list --count "${remote_ref}..HEAD")
    else
        warn "No remote tracking branch — counting all commits"
        commit_count=$(git -C "$PROJECT_ROOT" rev-list --count HEAD)
    fi

    if [[ "$commit_count" -le 1 ]]; then
        dim "Only ${commit_count} commit(s) ahead — nothing to squash"
        record_result "skip"
        return
    fi

    dim "Commits ahead of origin: ${commit_count}"
    echo ""
    git -C "$PROJECT_ROOT" log --oneline "${remote_ref}..HEAD" 2>/dev/null | sed 's/^/  /' || true
    echo ""

    git -C "$PROJECT_ROOT" reset --soft "$remote_ref"
    git -C "$PROJECT_ROOT" commit -m "$COMMIT_MSG"

    local new_sha
    new_sha=$(git -C "$PROJECT_ROOT" log -1 --oneline)
    success "Squashed ${commit_count} commits → ${new_sha}"
    record_result "ok"
}

# ── Step: Merge dev into main (if on a dev branch) ───────────────────────────
do_merge_to_main() {
    if ! $ON_DEV; then
        return
    fi

    step "Push ${DEV_BRANCH} to origin"

    if [[ "$DO_SQUASH" == true ]]; then
        dim "History was rewritten — using --force-with-lease"
        if $DO_PUSH; then
            run git -C "$PROJECT_ROOT" push origin "$DEV_BRANCH" --force-with-lease
        else
            dim "[no-push] skipping"
        fi
    else
        if $DO_PUSH; then
            run git -C "$PROJECT_ROOT" push origin "$DEV_BRANCH"
        else
            dim "[no-push] skipping"
        fi
    fi
    if [[ "$DRY_RUN" == false ]]; then
        record_result "ok"
    else
        record_result "skip"
    fi

    step "Merge ${DEV_BRANCH} → ${MAIN_BRANCH}"

    run git -C "$PROJECT_ROOT" checkout "$MAIN_BRANCH"
    if $DO_PUSH; then
        run git -C "$PROJECT_ROOT" pull origin "$MAIN_BRANCH"
    else
        dim "[no-push] skipping pull"
    fi
    run git -C "$PROJECT_ROOT" merge --no-ff "$DEV_BRANCH" -m "Merge ${DEV_BRANCH}: ${COMMIT_MSG}"

    if [[ "$DRY_RUN" == false ]]; then
        local merge_sha
        merge_sha=$(git -C "$PROJECT_ROOT" log -1 --oneline)
        success "Merged → ${merge_sha}"
        record_result "ok"
    else
        record_result "skip"
    fi
}

# ── Step: Tag ─────────────────────────────────────────────────────────────────
do_tag() {
    if ! $DO_TAG; then
        warn "Skipping tag (--no-tag)"
        record_result "skip"
        return
    fi

    local tag
    tag=$(next_tag)

    step "Tag ${MAIN_BRANCH} as ${tag}"
    dim "Message: ${TAG_MSG}"

    if [[ "$DRY_RUN" == false ]]; then
        local current
        current=$(git -C "$PROJECT_ROOT" rev-parse --abbrev-ref HEAD)
        if [[ "$current" != "$MAIN_BRANCH" ]]; then
            error "Expected to be on ${MAIN_BRANCH} but on ${current}"
            exit 1
        fi
    fi

    run git -C "$PROJECT_ROOT" tag -a "$tag" -m "$TAG_MSG"

    if [[ "$DRY_RUN" == false ]]; then
        success "Tagged: ${tag}"
        record_result "ok"
    else
        record_result "skip"
    fi
}

# ── Step: Push main + tags ────────────────────────────────────────────────────
do_push() {
    if ! $DO_PUSH; then
        warn "Skipping push (--no-push)"
        record_result "skip"
        return
    fi

    step "Push ${MAIN_BRANCH} + tags to origin"

    if [[ "$DO_SQUASH" == true ]] && ! $ON_DEV; then
        dim "History was rewritten — using --force-with-lease"
        run git -C "$PROJECT_ROOT" push origin "$MAIN_BRANCH" --force-with-lease
    else
        run git -C "$PROJECT_ROOT" push origin "$MAIN_BRANCH"
    fi
    run git -C "$PROJECT_ROOT" push origin --tags

    if [[ "$DRY_RUN" == false ]]; then
        record_result "ok"
    else
        record_result "skip"
    fi
}

# ── Step: Return to original branch ──────────────────────────────────────────
do_return_to_branch() {
    if ! $ON_DEV; then
        return
    fi

    step "Switch back to ${DEV_BRANCH}"
    run git -C "$PROJECT_ROOT" checkout "$DEV_BRANCH"
    success "Back on ${DEV_BRANCH}"
    record_result "ok"
}

# ── Summary ───────────────────────────────────────────────────────────────────
print_summary() {
    echo ""
    echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BOLD} Release Summary — KeyToMarvel.com-theme${NC}"
    echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    printf "%-6s  %-42s  %s\n" "Step" "Action" "Result"
    echo  "──────  ──────────────────────────────────────────  ──────"

    local i
    for i in "${!STEP_NAMES[@]}"; do
        local num=$((i + 1))
        local result="${STEP_RESULTS[$i]:-?}"
        local icon
        case "$result" in
            ok)   icon="${GREEN}✔ ok${NC}" ;;
            skip) icon="${YELLOW}– skip${NC}" ;;
            fail) icon="${RED}✖ FAIL${NC}" ;;
            *)    icon="${DIM}?${NC}" ;;
        esac
        printf "%-6s  %-42s  " "$num" "${STEP_NAMES[$i]:0:42}"
        echo -e "$icon"
    done

    if [[ "$DRY_RUN" == false ]]; then
        echo ""
        echo -e "${BOLD}Recent tags:${NC}"
        git -C "$PROJECT_ROOT" tag --sort=-version:refname | head -5 | sed 's/^/  /'
        echo ""
        echo -e "${BOLD}Branch tip:${NC}"
        git -C "$PROJECT_ROOT" log --oneline -1 "$MAIN_BRANCH" | sed "s/^/  main:  /"
        if $ON_DEV; then
            git -C "$PROJECT_ROOT" log --oneline -1 "$DEV_BRANCH" | sed "s/^/  ${DEV_BRANCH}:   /"
        fi
    fi

    echo ""
    echo -e "  Message: ${BOLD}${COMMIT_MSG}${NC}   Elapsed: ${BOLD}$(elapsed_time)${NC}"
    echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    if $DO_PUSH && [[ "$DRY_RUN" == false ]]; then
        echo -e "${BOLD}Next step — deploy theme to PROD:${NC}"
        echo -e "  ${DIM}# Auto-detect SSH (LAN first, then cloudflared) and deploy one theme:${NC}"
        echo -e "  ${DIM}bin/deploy.sh vegeta${NC}"
        echo -e "  ${DIM}# Or deploy every theme:${NC}"
        echo -e "  ${DIM}bin/deploy.sh --all${NC}"
        echo -e "  ${DIM}# Or just audit PROD state:${NC}"
        echo -e "  ${DIM}bin/deploy.sh --status${NC}"
        echo ""
    fi
}

trap 'echo ""; error "Release interrupted."; print_summary; exit 1' ERR

# ── Main ──────────────────────────────────────────────────────────────────────
main() {
    parse_args "$@"
    preflight

    if $AMEND; then
        # amend path: just stage & amend; skip squash/merge/tag/push (user manages)
        do_stage_and_commit
        if $DO_PUSH; then
            step "Force-push amended commit (since we rewrote history)"
            run git -C "$PROJECT_ROOT" push origin "$CURRENT_BRANCH" --force-with-lease
            record_result "ok"
        fi
        print_summary
        echo -e "${GREEN}${BOLD}Amend complete.${NC}"
        return
    fi

    do_stage_and_commit
    do_squash
    do_merge_to_main
    do_tag
    do_push
    do_return_to_branch

    print_summary
    echo -e "${GREEN}${BOLD}Release complete.${NC}"
}

main "$@"