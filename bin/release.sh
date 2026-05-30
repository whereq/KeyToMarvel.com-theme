#!/usr/bin/env bash
# =============================================================================
# KeyToMarvel.com-theme — Release Script
# =============================================================================
# Stage, commit, squash local commits into one, tag, and push to origin/main.
# If on a dev branch, merges into main first.
#
# Usage:
#   bin/release.sh [OPTIONS]
#
# OPTIONS:
#   -m, --message <msg>   Commit/tag message (required)
#   --no-squash           Skip squashing — push commits as-is
#   --tag-message <msg>   Tag annotation (default: same as --message)
#   --dry-run             Print all commands without executing
#   -h, --help            Show this help message
#
# Tag naming convention (auto-incremented):
#   v{major}.{minor}.{patch}   e.g. v0.0.2 → v0.0.3
#   Patch is auto-incremented. Bump major/minor manually for breaking changes.
#
# Typical flow:
#   1. Make changes on main (or dev branch)
#   2. bin/release.sh -m "Add catobigato theme"
#      → stages, commits, squashes, tags v0.0.N, pushes
#   3. On PROD: bin/deploy.sh <theme>
#
# Examples:
#   bin/release.sh -m "Redesign flowdesk login page"
#   bin/release.sh -m "Fix vegeta welcome page" --no-squash
#   bin/release.sh -m "Add chroniq theme" --dry-run
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
DRY_RUN=false
MAIN_BRANCH="main"
STEP=0
START_TIME=$(date +%s)

declare -a STEP_NAMES=()
declare -a STEP_RESULTS=()

# ── Auto-compute next tag ────────────────────────────────────────────────────
next_tag() {
    local last
    last=$(git -C "$PROJECT_ROOT" tag --sort=-version:refname \
        | grep -E '^v[0-9]+\.[0-9]+\.[0-9]+$' \
        | head -1 || true)

    if [[ -z "$last" ]]; then
        echo "v0.1.0"
        return
    fi

    local body="${last#v}"           # "0.0.2"
    local major="${body%%.*}"        # "0"
    local rest="${body#*.}"          # "0.2"
    local minor="${rest%%.*}"        # "0"
    local patch="${rest#*.}"         # "2"
    echo "v${major}.${minor}.$((patch + 1))"
}

# ── Parse arguments ───────────────────────────────────────────────────────────
parse_args() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
            -m|--message)
                [[ -n "${2:-}" ]] || { error "--message requires a value"; exit 1; }
                COMMIT_MSG="$2"; shift 2 ;;
            --no-squash)
                DO_SQUASH=false; shift ;;
            --tag-message)
                [[ -n "${2:-}" ]] || { error "--tag-message requires a value"; exit 1; }
                TAG_MSG="$2"; shift 2 ;;
            --dry-run)
                DRY_RUN=true; shift ;;
            -h|--help)
                sed -n '3,31p' "$0" | sed 's/^# \?//'
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
}

# ── Pre-flight ────────────────────────────────────────────────────────────────
preflight() {
    local tag
    tag=$(next_tag)

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

    info "K2M Theme release — branch: ${BOLD}${CURRENT_BRANCH}${NC} | next tag: ${BOLD}${tag}${NC} | dry-run: ${BOLD}${DRY_RUN}${NC}"
    if $ON_DEV; then
        info "Dev branch detected — will merge ${DEV_BRANCH} → ${MAIN_BRANCH}"
    fi
    echo ""
}

# ── Step: Stage and commit pending changes ────────────────────────────────────
do_stage_and_commit() {
    step "Stage and commit pending changes"

    if [[ "$DRY_RUN" == true ]]; then
        dim "[dry-run] would run: git add -A && git commit -m \"${COMMIT_MSG}\""
        record_result "skip"
        return
    fi

    local has_changes=false
    if ! git -C "$PROJECT_ROOT" diff --quiet; then has_changes=true; fi
    if ! git -C "$PROJECT_ROOT" diff --cached --quiet; then has_changes=true; fi
    if [[ -n "$(git -C "$PROJECT_ROOT" ls-files --others --exclude-standard)" ]]; then has_changes=true; fi

    if [[ "$has_changes" == false ]]; then
        warn "Working tree already clean — nothing to commit"
        record_result "skip"
        return
    fi

    dim "Staging all changes..."
    git -C "$PROJECT_ROOT" status --short | sed 's/^/  /'
    echo ""

    git -C "$PROJECT_ROOT" add -A
    git -C "$PROJECT_ROOT" commit -m "$COMMIT_MSG"

    local new_sha
    new_sha=$(git -C "$PROJECT_ROOT" log -1 --oneline)
    success "Committed → ${new_sha}"
    record_result "ok"
}

# ── Step: Squash commits ─────────────────────────────────────────────────────
do_squash() {
    if [[ "$DO_SQUASH" == false ]]; then
        warn "Skipping squash (--no-squash)"
        record_result "skip"
        return
    fi

    step "Squash local commits into one"

    if [[ "$DRY_RUN" == true ]]; then
        dim "[dry-run] would compute commits ahead of origin and squash"
        record_result "skip"
        return
    fi

    # Determine how many commits are ahead of origin
    local remote_ref="origin/${CURRENT_BRANCH}"
    local commit_count

    # Check if remote tracking branch exists
    if git -C "$PROJECT_ROOT" rev-parse --verify "$remote_ref" &>/dev/null; then
        commit_count=$(git -C "$PROJECT_ROOT" rev-list --count "${remote_ref}..HEAD")
    else
        # No remote branch — count all commits (first push scenario)
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

    dim "git reset --soft ${remote_ref}"
    dim "git commit -m \"${COMMIT_MSG}\""

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
        run git -C "$PROJECT_ROOT" push origin "$DEV_BRANCH" --force-with-lease
    else
        run git -C "$PROJECT_ROOT" push origin "$DEV_BRANCH"
    fi
    record_result "ok"

    step "Merge ${DEV_BRANCH} → ${MAIN_BRANCH}"

    run git -C "$PROJECT_ROOT" checkout "$MAIN_BRANCH"
    run git -C "$PROJECT_ROOT" pull origin "$MAIN_BRANCH"
    run git -C "$PROJECT_ROOT" merge --no-ff "$DEV_BRANCH" -m "Merge ${DEV_BRANCH}: ${COMMIT_MSG}"

    if [[ "$DRY_RUN" == false ]]; then
        local merge_sha
        merge_sha=$(git -C "$PROJECT_ROOT" log -1 --oneline)
        success "Merged → ${merge_sha}"
    fi
    record_result "ok"
}

# ── Step: Tag ─────────────────────────────────────────────────────────────────
do_tag() {
    local tag
    tag=$(next_tag)

    step "Tag ${MAIN_BRANCH} as ${tag}"
    dim "Message: ${TAG_MSG}"

    # If on dev branch, we already checked out main in do_merge_to_main
    # If on main, we're already there
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
    fi
    record_result "ok"
}

# ── Step: Push main + tags ────────────────────────────────────────────────────
do_push() {
    step "Push ${MAIN_BRANCH} + tags to origin"

    if [[ "$DO_SQUASH" == true ]] && ! $ON_DEV; then
        dim "History was rewritten — using --force-with-lease"
        run git -C "$PROJECT_ROOT" push origin "$MAIN_BRANCH" --force-with-lease
    else
        run git -C "$PROJECT_ROOT" push origin "$MAIN_BRANCH"
    fi
    run git -C "$PROJECT_ROOT" push origin --tags

    record_result "ok"
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
    echo -e "${BOLD}Next step — deploy theme to PROD:${NC}"
    echo -e "  ${DIM}ssh ssh.whereq.com${NC}"
    echo -e "  ${DIM}cd ~/github/KeyToMarvel.com-theme${NC}"
    echo -e "  ${DIM}bin/deploy.sh <theme>${NC}"
    echo ""
}

trap 'echo ""; error "Release interrupted."; print_summary; exit 1' ERR

# ── Main ──────────────────────────────────────────────────────────────────────
main() {
    parse_args "$@"
    preflight

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
