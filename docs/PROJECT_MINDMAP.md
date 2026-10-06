# KeyToMarvel.com-theme — Comprehensive Project Mindmap

> **Audience:** Both the user (human) and the AI agent. This is the canonical
> "how this project works" reference. Read this before touching `bin/release.sh`
> or `bin/deploy.sh`, or before adding a new theme/page.

---

## 0. One-paragraph summary

This repo is a **collection of independent Keycloakify v11 theme packages** that
all deploy to a single shared Keycloak 26.0.7 server. Each `k2m-theme-*` directory
is fully self-contained (own `package.json`, `yarn.lock`, `node_modules`, Vite
config). There is no workspace, no root `package.json`. The repo-level scripts
in `bin/` (release.sh + deploy.sh) orchestrate the git-to-PROD cycle. The
authoritative source of truth for which realm uses which theme for login /
account / admin / email is the `REALM_THEME_MAP` in `bin/deploy.sh`.

---

## 1. Top-level directory tree

```
KeyToMarvel.com-theme/
├── .claude/                       # Claude Code session state (UNTRACKED — see §14)
│   ├── settings.local.json        # tool-permissions for Claude Code
│   ├── skills/import-realm/       # local skill: kcadm import a realm JSON
│   └── worktrees/                 # git worktree checkouts (currently empty)
├── .gitignore                     # ignores node_modules, dist, *.local, etc.
├── CLAUDE.md                      # Claude Code guidance (concise version of this doc)
├── bin/
│   ├── release.sh                 # ★ LOCAL → git: stage/squash/tag/push
│   └── deploy.sh                  # ★ PROD:  pull/build/deploy/verify themes
├── dist_keycloak/                 # ignored — placeholder; real outputs are per-theme
├── docs/
│   ├── BUILD_AND_DEPLOY.md        # full Keycloakify build/deploy manual
│   ├── GAP_REPORT.md              # dependency gap analysis (keycloakify etc.)
│   ├── Local_Debug.md             # debugging without running Keycloak
│   └── PROJECT_MINDMAP.md         # ★ this file
└── k2m-theme-*/                   # ★ one self-contained package per theme
    ├── package.json
    ├── vite.config.ts             # sets themeName + accountThemeImplementation
    ├── src/
    │   ├── main.tsx               # entrypoint + DEV mock kcContext
    │   └── keycloak-theme/        # all the theme code
    │       ├── login/             # KcPage.tsx + pages/ + messages/
    │       ├── account/           # (only themes w/ accountThemeImplementation != "none")
    │       ├── admin/             # (only vegeta)
    │       ├── email/             # (only vegeta)
    │       ├── welcome/           # (only vegeta) FTL for /welcome page
    │       ├── layout/            # shared Template + i18n
    │       ├── profile/           # shared profile form bits
    │       └── shared/            # vendored PatternFly + custom ui/
    ├── stories/                   # (optional) Storybook stories
    ├── dist_keycloak/             # ★ keycloakify build output — JAR lives here
    ├── dist/                      # vite build output (intermediate)
    └── node_modules/              # own dependencies
```

---

## 2. Theme registry — THE source of truth

Each theme lives in its own dir and produces one Keycloak theme provider JAR.
The naming convention is critical because **the internal theme name inside the
JAR must match what the DB realm rows point at**.

| Alias        | Directory                | ThemeName in vite.config.ts    | JAR internal name   | Has welcome | Has dist_keycloak/theme/ | Notes |
|--------------|--------------------------|--------------------------------|---------------------|-------------|--------------------------|-------|
| `superhero`  | `k2m-theme-superhero`    | (uses pkg.json name fallback)  | `k2m-theme-superhero` | n           | **y** (account, login, admin) | Full theme: login + account + admin |
| `morph`      | `k2m-theme-morph`        | (uses pkg.json name fallback)  | **`keytomarvel-com-theme`** ← divergent | n | **y** (account, login) | Full theme. JAR internal name ≠ dir name |
| `vegeta`     | `k2m-theme-vegeta`       | `k2m-theme-vegeta`             | `k2m-theme-vegeta`  | **y**       | n                        | The "everything" theme: login + account + admin + **email** + **welcome page** |
| `flowdesk`   | `k2m-theme-flowdesk`     | `k2m-theme-flowdesk`           | `k2m-theme-flowdesk`| n           | n                        | Login only |
| `chroniq`    | `k2m-theme-chroniq`      | `k2m-theme-chroniq`            | `k2m-theme-chroniq` | n           | n                        | Login only |
| `catobigato` | `k2m-theme-catobigato`   | `k2m-theme-catobigato`         | `k2m-theme-catobigato` | n        | n                        | Login only |
| `whereq.com` | `k2m-theme-whereq-com`   | `k2m-theme-whereq-com`         | `k2m-theme-whereq-com` | n        | n                        | Login only |
| `whereq.cc`  | `k2m-theme-whereq-cc`    | `k2m-theme-whereq-cc`          | `k2m-theme-whereq-cc` | n        | n                        | Login only (newest, added v0.0.5) |

### Critical observation: the morph/superhero `dist_keycloak/theme/` divergence

For morph and superhero, even though the directory is `k2m-theme-morph/`, the
**JAR internal theme dir is `theme/keytomarvel-com-theme/`** (because morph's
`package.json` `name` is `"keytomarvel-com-theme"` and keycloakify falls back
to that). The current `bin/deploy.sh` registry encodes this:

```bash
[superhero]="k2m-theme-superhero:k2m-theme-superhero:n:y"
[morph]="k2m-theme-morph:keytomarvel-com-theme:n:y"
```

Where the 2nd column is `THEME_INTERNAL`. The deploy script must use
`THEME_INTERNAL` for both the JAR destination filename AND the `dist_keycloak/theme/`
path AND the `themes/` destination on PROD. The current `REALM_THEME_MAP` already
references `keytomarvel-com-theme` correctly.

**Lesson:** never assume the JAR internal theme dir name = directory name. Always
trust `THEME_INTERNAL` from the registry.

---

## 3. Build pipeline (per theme)

Each theme follows the same pipeline:

```
yarn install                       # postinstall: keycloakify sync-extensions
        ↓
yarn build                         # tsc -b && vite build → dist/
        ↓
yarn build-keycloak-theme          # yarn build && keycloakify build
        ↓
<theme>/dist_keycloak/
  ├── keycloak-theme-for-kc-22-to-25.jar            ← KC 22, 23, 24, 25
  ├── keycloak-theme-for-kc-all-other-versions.jar  ← KC 26+ (this is what PROD uses)
  └── .gitignore                                    ← 1 byte; prevent JAR commit
```

Important: `yarn build` alone is **not enough**. The JAR is produced by the
**additional** `keycloakify build` step. We always run `yarn build-keycloak-theme`.

Inside the JAR (KC 26+ variant):

```
META-INF/MANIFEST.MF
theme/
└── <INTERNAL_NAME>/
    ├── login/         ← FTL, messages, resources (CSS, JS, images)
    ├── account/       ← (full themes) React SPA assets
    ├── admin/         ← (vegeta + superhero) React SPA assets
    ├── email/         ← (vegeta only) html/ + text/ + messages/
    └── ...
```

For superhero + morph, keycloakify **also** drops the exploded theme dirs to
`<theme>/dist_keycloak/theme/<INTERNAL_NAME>/` — these are used by deploy.sh
to copy static files that don't belong in the JAR (or are easier to maintain
on disk). For other themes, those don't exist; only the JAR has everything.

---

## 4. PROD environment

```
HOST (any of):
  • ssh whereq@whereq              # LAN; resolves to 192.168.0.196
  • ssh ssh.whereq.cc              # external; tunneled via cloudflared
  (auto-detect order: LAN first, then cloudflared — see §13)

LAYOUT on PROD:
  ~/git/KeyToMarvel.com-theme/                          # THIS repo (clone)
  ~/git/KeyToMarvel.com/docker/volumes/keycloak/
    ├── providers/
    │   ├── k2m-theme-vegeta.jar
    │   ├── k2m-theme-flowdesk.jar
    │   ├── k2m-theme-chroniq.jar
    │   ├── k2m-theme-catobigato.jar
    │   ├── k2m-theme-whereq-com.jar
    │   ├── k2m-theme-whereq-cc.jar
    │   ├── whereq-keycloak.jar        # custom Keycloak extensions (WeChat IdP etc.)
    │   └── *.bak.<timestamp>          # deploy.sh keeps last 3 backups per theme
    └── themes/
        └── k2m-theme-vegeta/
            └── welcome/               # vegeta welcome page (not in JAR)

CONTAINERS (docker compose in ~/git/KeyToMarvel.com/docker):
  keycloak-k2m        # Keycloak server (port 8080 internal, exposed via reverse proxy)
  whereq-db           # Postgres (db=k2m, user=whereq)

DB SCHEMA (Postgres, keycloak DB):
  realm table → name, login_theme, account_theme, admin_theme, email_theme
  client_attributes → per-client overrides for login_theme etc. (PROBLEM: REALM_THEME_MAP doesn't manage these — see §6)
```

---

## 5. Realms and theme assignments (REALM_THEME_MAP — DB source of truth)

This is what `bin/deploy.sh` enforces on every run. **Every realm that's
configured to use our themes must be listed here.** Missing realms = silent
bug (deploy.sh just skips them with a warning).

| Realm name         | login_theme              | account_theme           | admin_theme           | email_theme           | App                     |
|--------------------|--------------------------|-------------------------|-----------------------|-----------------------|-------------------------|
| `master`           | k2m-theme-vegeta         | k2m-theme-vegeta        | k2m-theme-vegeta      | k2m-theme-vegeta      | Keycloak admin console  |
| `whereq`           | k2m-theme-vegeta         | k2m-theme-vegeta        | k2m-theme-vegeta      | k2m-theme-vegeta      | whereq.com app          |
| `catobigato`       | k2m-theme-catobigato     | k2m-theme-catobigato    | k2m-theme-catobigato  | k2m-theme-vegeta      | catobigato.com          |
| `flowdesk.top`     | k2m-theme-flowdesk       | k2m-theme-vegeta        | k2m-theme-vegeta      | k2m-theme-vegeta      | flowdesk.top            |
| `whereq.com`       | k2m-theme-whereq-com     | k2m-theme-vegeta        | k2m-theme-vegeta      | k2m-theme-vegeta      | whereq.com (login alias)|
| `chroniq.cc`       | k2m-theme-chroniq        | k2m-theme-vegeta        | k2m-theme-vegeta      | k2m-theme-vegeta      | chroniq.cc              |
| `whereq.cc-realm`  | k2m-theme-whereq-cc      | k2m-theme-vegeta        | k2m-theme-vegeta      | k2m-theme-vegeta      | whereq.cc (gallery app) |
| `caijing.today-realm` | k2m-theme-vegeta      | k2m-theme-vegeta        | k2m-theme-vegeta      | k2m-theme-vegeta      | caijing.today (MISSING from current map!) |
| `whereq.cloud`     | (empty / null)           | (empty / null)          | (empty / null)        | (empty / null)        | whereq.cloud (unassigned realm — should we manage it?) |

### Currently unhandled realms on PROD

`bin/deploy.sh` should:
1. **Either** add `caijing.today-realm` to REALM_THEME_MAP (it's set to vegeta everywhere — looks intentional)
2. **Either** add `whereq.cloud` (probably leave empty — "unconfigured" is correct) OR explicitly set to `null`
4. **Auto-discover** any realm present in the DB but missing from the map → warn loudly

---

## 6. The client_attributes gotcha (from BUILD_AND_DEPLOY.md)

Each realm's 4 theme columns can be **overridden per-client** via the
`client_attributes` table:

```sql
SELECT c.client_id, ca.value
FROM client c
JOIN client_attributes ca ON ca.client_id = c.id
JOIN realm r ON r.id = c.realm_id
WHERE r.name = 'whereq.com' AND ca.name = 'login_theme';
```

If a client has a `login_theme` attribute set, Keycloak uses it INSTEAD of the
realm setting. **The current deploy.sh never touches this table** — meaning:

- A theme swap on a realm has zero effect on any client that has an override set
- The fix is one-time: clear the override via Admin Console or SQL

**deploy.sh should detect and warn about** client_attribute overrides that
shadow the realm theme for realms it manages. Optionally clear them (with
`--purge-client-overrides` flag) for idempotency.

---

## 7. The git/release/deploy lifecycle

```
┌─────────────────────────────────────────────────────────────┐
│  LOCAL (WSL)                                                │
│                                                             │
│  1. Edit code in k2m-theme-<name>/                          │
│  2. yarn dev / yarn storybook  ← 99% of work happens here  │
│  3. yarn build-keycloak-theme  ← optional, only to verify   │
│                                                             │
│  4. bin/release.sh -m "msg"                                 │
│     • stage (git add -A)                                    │
│     • commit                                                │
│     • squash ahead-of-origin into one (unless --no-squash)  │
│     • if on dev branch: push dev, merge --no-ff → main      │
│     • tag main v0.0.X (auto-bump patch)                     │
│     • push main --force-with-lease  (if squashed)           │
│     • push --tags                                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ (manual SSH to PROD)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  PROD (whereq)                                              │
│                                                             │
│  5. bin/deploy.sh <alias> [--skip-build|--skip-pull|...]    │
│     [0/6] preflight (docker containers up? dirs exist?)     │
│     [1/6] git fetch + checkout main + pull --ff-only        │
│     [2/6] yarn install --frozen-lockfile                    │
│           yarn build-keycloak-theme                         │
│     [3/6] copy <theme>/dist_keycloak/keycloak-theme-for-    │
│           kc-all-other-versions.jar →                       │
│           <providers_dir>/<INTERNAL>.jar  (with backup)    │
│     [4/6] copy welcome/ (HAS_WELCOME=y)                     │
│           copy dist_keycloak/theme/<INTERNAL>/ (HAS_THEME_DIR=y)
│     [5/6] docker restart keycloak-k2m + wait for /health    │
│     [6/6] SELECT/verify all REALM_THEME_MAP rows; UPDATE    │
│           any mismatches. (Does NOT touch client_attrs.)   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. Release script (`bin/release.sh`) — current capabilities & gaps

### What it does well
- Bumps `vX.Y.Z` tag automatically (patch)
- Squashes multiple local commits into one
- Handles dev branch → main merge with `--no-ff`
- `--dry-run`, `--no-squash`, `--tag-message`
- Pretty progress output with per-step results

### Gaps & required enhancements
1. **No way to commit only some themes.** With multi-theme repos, a change to
   `k2m-theme-flowdesk/` shouldn't require including unrelated changes from
   other dirs. Need `--only <dir>` or `--themes a,b`.
2. **Doesn't notice untracked `.claude/` dirs** in 6 of 8 theme dirs + repo root.
   `git add -A` will sweep them all in, bloating the repo with Claude session
   state. Need `.gitignore` update OR `--ignore-untracked-claude` (clean it
   first).
3. **No rollback / undo.** If the push breaks things, only `git reset` + force
   push can fix it. No support for `git tag -d` cleanup, no `release --undo`.
4. **`--amend`** missing — useful for fixing the last commit message without
   a new tag.
5. **Doesn't verify a build happened.** A release can tag & push code that
   hasn't been built (the deploy step builds, but a local release is sometimes
   done with `yarn dev` only). Could optionally verify the JAR is fresh.
6. **Theme list hardcoded** — adding a new `k2m-theme-X/` requires editing the
   deploy.sh registry, but release.sh doesn't know about themes. Should
   auto-discover `k2m-theme-*` dirs.
7. **No pre-commit hook / no pre-flight on remote state** — what if origin/main
   has moved while you were working? Will the merge conflict?
8. **Next-tag computation assumes linear v0.0.X history.** No support for
   `--major`, `--minor`, `--set X.Y.Z`, or `--no-tag`.

---

## 9. Deploy script (`bin/deploy.sh`) — current capabilities & gaps

### What it does well
- Theme registry with HAS_WELCOME / HAS_THEME_DIR per theme
- JAR backup with last-3 retention
- Pre-flight (containers, dirs)
- DB verification + auto-fix of all REALM_THEME_MAP entries
- `--skip-build`, `--skip-pull`, `--dry-run`, `--db-only`, `--list`

### Gaps & required enhancements
1. **MISSING REALMS** in REALM_THEME_MAP: `caijing.today-realm` (set to vegeta
   everywhere on PROD), `whereq.cloud` (null).
2. **Doesn't auto-detect SSH target.** User has to manually ssh first, then run
   the script on PROD. Should be runnable from LOCAL too: `bin/deploy.sh <alias>`
   on local machine → auto-detects LAN vs external → runs on PROD via SSH.
3. **No `--status` / `--verify` mode** — only way to check PROD state right now
   is to actually deploy. Should be possible to query: JARs on disk, JAR dates,
   realm DB rows, container health, drift detection.
4. **No `--all` mode** — deploy every theme in sequence (e.g. when keycloakify
   version bumps and every JAR must be rebuilt).
5. **Doesn't handle morph/superhero when dist_keycloak/theme/ internal name
   mismatches the dir name.** Already partially handled via `THEME_INTERNAL`,
   but the welcome-in-JAR case isn't detected. vegeta's welcome dir is a
   **source-only** asset (`src/keycloak-theme/welcome/`) NOT in the JAR.
6. **Doesn't verify the JAR contents match expected theme structure.** A
   stale build (wrong `themeName` in vite.config.ts) would deploy a JAR with
   `theme/wrongname/` and Keycloak would silently ignore it. Should `unzip -l`
   to confirm `theme/<INTERNAL>/` is at the top.
7. **No client_attributes override detection/cleanup.** See §6.
8. **Health-check waits only 60s** (`MAX_ATTEMPTS=30 × sleep 2`). On slow
   disks, building 8 themes in sequence can take longer. Should be configurable
   or longer default.
9. **`run_sql` swallows stderr.** If the DB is unreachable, error is invisible.
10. **`--db-only` skips ALL other steps but still requires themes dir** —
    should be safe to run on a server without themes/providers.
11. **Doesn't handle the case where a new theme is added.** If user creates
    `k2m-theme-newapp/`, deploy.sh has no idea until registry is updated.
    Should auto-discover + warn about new dirs not in registry.
12. **Theme list doesn't show what's actually deployed vs what's a build artifact.**
    `--list` should show on-disk JAR date + size + sha for quick audit.
13. **No way to deploy the OTHER JAR (`keycloak-theme-for-kc-22-to-25.jar`)**.
    Currently a no-op for this repo (PROD runs KC 26+), but worth a `--kc-22-to-25`
    flag for completeness.
14. **`docker restart` is hardcoded** — should support `--no-restart` (some
    users prefer to restart manually after multiple deploys in a batch).
15. **Backup naming collision risk.** `cp JAR.bak.<ts>` works, but cleanup
    uses `ls -t ... | tail -n +4 | xargs rm -f`. If two deploys happen in
    the same second, the second backup overwrites the first. Use `$$` PID.
16. **No email templates copy for vegeta.** vegeta has `src/keycloak-theme/email/`
    which gets baked into the JAR by keycloakify, but if any email assets ever
    need to live on disk (e.g. custom logos), there's no codepath. Currently
    fine — keycloakify handles it — but worth noting in this map.

---

## 10. SSH access — the network model

Two entry points to the same box:

```bash
# Inside home (LAN) — fast, direct
ssh whereq@whereq          # ~/.ssh/config maps this to 192.168.0.196, key wq_mini

# Outside home — Cloudflare-tunneled
ssh ssh.whereq.cc          # ProxyCommand: cloudflared access ssh --hostname %h
```

**Auto-detect logic** (used in CLAUDE.md):
```bash
if ssh -o ConnectTimeout=6 -o BatchMode=yes whereq@whereq 'echo ok' 2>/dev/null; then
    TARGET="whereq@whereq"           # LAN
else
    TARGET="ssh.whereq.cc"           # Cloudflare
fi
```

The CURRENT `bin/release.sh` summary hardcodes `ssh ssh.whereq.com` which is
**wrong** (retired hostname, no longer resolves). Fix to `ssh.whereq.cc`.

Both deploy.sh and the local wrapper should:
- probe LAN first (cheaper, faster, no cloudflared dependency)
- fall back to cloudflared if LAN probe times out
- print which target was chosen

---

## 11. Theme directory conventions inside each package

Every theme follows the same Keycloakify convention:

```
src/
├── main.tsx                    # entrypoint; DEV mode injects mock kcContext
└── keycloak-theme/
    ├── kc.gen.tsx                  # ⚠ GENERATED by `keycloakify sync-extensions`
    │                                #   Do NOT hand-edit. Regenerated on postinstall.
    ├── layout/
    │   ├── Template.tsx           # page shell (header, footer, background)
    │   └── i18n.ts                # i18n setup
    ├── login/
    │   ├── KcPage.tsx             # switch(kcContext.pageId) → page component
    │   ├── pages/                 # one folder per *.ftl page
    │   │   ├── Login.tsx
    │   │   ├── Register.tsx
    │   │   ├── LoginPassword.tsx
    │   │   ├── LoginOtp.tsx
    │   │   ├── LoginUpdatePassword.tsx
    │   │   └── ...
    │   └── messages/
    │       ├── messages_en.properties
    │       └── messages_zh_CN.properties
    ├── account/                  # only if accountThemeImplementation != "none"
    │   ├── KcPage.tsx
    │   └── ...
    ├── admin/                    # only vegeta
    │   ├── App.tsx, Root.tsx, ...
    │   └── KcContext.ts          # KC admin React context shape
    ├── email/                    # only vegeta
    │   ├── html/                 # *.html.ftl templates
    │   ├── text/                 # *.text.ftl templates
    │   ├── messages/
    │   └── theme.properties
    ├── welcome/                  # only vegeta — the FTL for Keycloak's /welcome endpoint
    │   ├── index.ftl
    │   └── theme.properties
    ├── profile/                  # shared profile form fragments
    └── shared/                   # shared UI bits
        ├── ui/                   # custom design system (Button, Input, Card, ...)
        └── ...                   # vendored PatternFly / keycloak-ui-shared
```

**Vite aliases** (in every `vite.config.ts`):
- `@` → `/src`
- `@keycloak-theme` → `/src/keycloak-theme`

---

## 12. Tailwind version split (gotcha)

| Theme            | Tailwind version | Config style                              |
|------------------|------------------|-------------------------------------------|
| superhero        | **v3**           | `tailwind.config.js` + `postcss.config.js` |
| morph            | **v3**           | `tailwind.config.js` + `postcss.config.js` |
| vegeta           | **v4**           | `@tailwindcss/vite` (no config files)      |
| flowdesk         | **v4**           | `@tailwindcss/vite`                        |
| catobigato       | **v4**           | `@tailwindcss/vite`                        |
| whereq.com       | **v4**           | `@tailwindcss/vite`                        |
| whereq.cc        | **v4**           | `@tailwindcss/vite`                        |
| chroniq          | **v4**           | `@tailwindcss/vite`                        |

⚠ Tailwind v3 themes cannot use v4 syntax and vice versa. The `tailwind.css.js`
file in morph (line `tailwind.css.js` entry in package.json's source) and
`tailwind.config.js` files are v3-only.

---

## 13. Per-theme "what is it" cheat sheet

### `vegeta` — the canonical everything theme
- Full: login + account + admin + email + welcome
- `accountThemeImplementation: "Single-Page"` (React SPA for /account)
- HAS_WELCOME=y (welcome dir is copied separately because keycloakify puts the
  welcome inside the JAR but we want disk overrides to win — see §9 item 5)
- This is the **default theme** for any realm that doesn't override login_theme.
- Most recent activity: email template fixes, i18n improvements.

### `superhero` — the original full theme
- Full: login + account + admin (no email, no welcome)
- `accountThemeImplementation: "Single-Page"`
- `package.json` `name` = `"k2m-theme-superhero"` so JAR internal = same
- HAS_THEME_DIR=y (account + login + admin in dist_keycloak/theme/)
- **GAP_REPORT.md tracks this theme's outdated deps.**

### `morph` — the legacy full theme
- Full: login + account
- `accountThemeImplementation: "Single-Page"`
- `package.json` `name` = **`"keytomarvel-com-theme"`** ← JAR internal name diverges
- HAS_THEME_DIR=y (account + login at dist_keycloak/theme/keytomarvel-com-theme/)
- The legacy name lives on in `whereq.com` realm DB rows (`login_theme=k2m-theme-vegeta` actually, but historical refs in docs).

### `flowdesk`, `chroniq`, `catobigato`, `whereq.com`, `whereq.cc` — login-only themes
- Each is a single-realm themed login page
- `accountThemeImplementation: "none"` — they all fall back to vegeta for /account
- Identical architecture, different design system
- `whereq.cc` is the newest (added v0.0.5, Aug 2026)

---

## 14. The `.claude/` problem

Six of the eight theme directories + repo root have untracked `.claude/`
subdirectories from Claude Code sessions:

```
.claude/                             ← untracked
k2m-theme-catobigato/.claude/         ← untracked
k2m-theme-chroniq/.claude/           ← untracked
k2m-theme-flowdesk/.claude/          ← untracked
k2m-theme-whereq-cc/.claude/         ← untracked
k2m-theme-whereq-com/.claude/        ← untracked
```

Current `release.sh` does `git add -A`, which would sweep ALL of these into
the next commit. Two options:

**Option A (preferred):** gitignore them via `.gitignore`:
```
.claude/
**/.claude/
```

**Option B:** in `release.sh`, pre-clean before staging — `git clean -fd -e
.claude/` etc.

Both are valid. Recommend A (the `.claude/` dirs are per-machine state and
should never be committed).

---

## 15. Decision matrix — when to use which tool

| Goal                                       | Command                                            | Where       |
|-------------------------------------------|----------------------------------------------------|-------------|
| Iterate on a page visually                | `cd k2m-theme-<x> && yarn dev`                     | LOCAL       |
| Iterate via Storybook                     | `cd k2m-theme-<x> && yarn storybook`                | LOCAL       |
| Build the JAR                             | `cd k2m-theme-<x> && yarn build-keycloak-theme`    | LOCAL       |
| Ship to git                               | `bin/release.sh -m "msg"`                          | LOCAL       |
| Deploy one theme                          | `bin/deploy.sh <alias>`                            | PROD (or LOCAL via auto-SSH) |
| Deploy every theme                        | `bin/deploy.sh --all`                              | PROD        |
| Audit PROD state without changing         | `bin/deploy.sh --status`                           | PROD        |
| Fix a stuck DB theme row                  | `bin/deploy.sh <realm> --db-only`                  | PROD        |
| Add a new realm                           | (see `.claude/skills/import-realm/`)               | PROD        |
| Onboard a new realm's SMTP/IdPs/themes    | (see `onboard-realm` skill)                        | PROD        |

---

## 16. Future-proofing — what could change

1. **KC server upgrade to 26.5+** → bump `@keycloakify/*` to `~260502.x`,
   `keycloak-js` to 26.5.x, `@keycloak/keycloak-admin-client` to 26.5.x — all
   together. See GAP_REPORT.md.
2. **New theme for new app** → copy `k2m-theme-whereq-com/` (smallest, login-only,
   most recent), edit `package.json`, `vite.config.ts` (themeName), design tokens,
   messages. Add to REALM_THEME_MAP and THEME_REGISTRY in deploy.sh.
3. **PatternFly v6** → wait for `@keycloakify/*` to declare support; PF5→6 is a
   major rewrite.
4. **More dev branches** → release.sh already handles them; just ensure they're
   rebased onto origin/main before release.
5. **Migration off cloudflared** (e.g. to Tailscale) → SSH config gets one new
   Host entry; auto-detect logic stays the same.

---

## 17. Glossary

- **Theme / package / JAR**: a Keycloakify build artifact for one Keycloak theme
- **Internal name**: the directory name inside `theme/` in the JAR — must match
  the DB column value
- **REALM_THEME_MAP**: bash assoc array mapping realm name → 4 theme columns
- **HAS_WELCOME / HAS_THEME_DIR**: registry flags indicating whether to copy
  `src/keycloak-theme/welcome/` and/or `dist_keycloak/theme/<name>/` separately
- **Keycloakify**: npm package that turns React components into Keycloak theme JARs
- **kcContext**: the JSON Keycloak injects into the page at render time; in DEV
  mode we mock this in `src/main.tsx`
- **kc.gen.tsx**: generated TS types for `kcContext`, regenerated on postinstall
- **provider JAR**: a `.jar` placed in Keycloak's `providers/` dir that registers
  one or more themes